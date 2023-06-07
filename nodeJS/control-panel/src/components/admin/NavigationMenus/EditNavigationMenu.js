import React, { useState, useEffect } from 'react'
import { getNavigationMenu, updateNavigationMenu, createNavigationMenuItem, updateNavigationMenuItem, 
    removeNavigationMenuSubItem, getArticles, reorderMenuItems } from './NavigationMenusAPI'
import { useTranslation } from "react-i18next"
import { toast } from 'react-toastify'
import { ThreeDots } from  'react-loader-spinner'
import LocalizedTextEditor from '../Shared/LocalizedTextEditor'
import { useParams, Link } from 'react-router-dom'
import { getLocalizedText } from '../utils/utils'
import { MdAdd, MdOutlineModeEditOutline, MdDragIndicator, MdSave, MdClose, MdPlaylistAdd, MdDeleteForever, MdOutlineCheck } from 'react-icons/md'

const EditNavigationMenu = () => {

    const [menu, setMenu] = useState({ title: {} });
    const [menuItem, setMenuItem] = useState();
    const [loading, setLoading] = useState(false);
    const { t, i18n } = useTranslation();
    const [contentLocale, setContentLocale] = useState('en');
    const { menuId } = useParams();
    const [validationMessage, setValidationMessage] = useState();
    const [dragTo, setDragTo] = useState(-1);
    const [itemToDelete, setItemToDelete] = useState();
    const [subItemToDelete, setSubItemToDelete] = useState();
    const [articles, setArticles] = useState([]);

    const setLocalTextValue = (textObject, newValue) => {
        if (contentLocale == 'en') {
            textObject.english = newValue;
        } else if (contentLocale == 'ar') {
            textObject.arabic = newValue;
        } else if (contentLocale == 'tr') {
            textObject.turkish = newValue;
        }
    }

    useEffect(() => {
        getArticles().then(res => {
            setArticles(res.data);
        }).catch(e => {
            console.log(e);
        });
    }, []);

    const changeLocale = (newLocale) => {
        setContentLocale(newLocale);
    }

    const updateItemTitle = (newValue, locale) => {
        setContentLocale(locale);
        let cloned = JSON.parse(JSON.stringify(menuItem));
        setLocalTextValue(cloned.title, newValue);
        setMenuItem(cloned);
    }

    const updateLink = (event) => {
        let cloned = JSON.parse(JSON.stringify(menuItem));
        cloned.link = event.target.value;
        setMenuItem(cloned);
    }

    const updatePublished = (event, item) => {
        let cloned = JSON.parse(JSON.stringify(item));
        cloned.published = event.target.checked;
        updateNavigationMenuItem(cloned);
        reload();
    }

    const updateSubItemPublished = (event, item) => {
        let cloned = JSON.parse(JSON.stringify(item));
        cloned.published = event.target.checked;
        updateNavigationMenuItem(cloned);

        reload();
    }





    const reload = () => {
        setLoading(true);
        getNavigationMenu(menuId).then(res => {
            setLoading(false);
            setMenu(res.data.menu);
        }).catch(e => {
            setLoading(false);
            console.log(e);
        });
    }
    useEffect(() => {
        reload();
    }, []);

    const createMenuItem = () => {
        setMenuItem({ _id: null, title: {}, link: '', parent:null });
    }
    const createSubItem = (parentItem) => {
        if(!parentItem.parent){
            setMenuItem({ _id: null, parent: parentItem._id, title: {}, link: '', parentItem: parentItem });
        }else{
            setMenuItem({ _id: null, parent: null, title: {}, link: '', parentItem: parentItem });
        }
        

    }
    const cancelMenuItem = () => {
        setMenuItem(null);
    }

    const selectToEdit = (selectedMenuItem) => {
        setMenuItem({...selectedMenuItem, menu: menu._id});
        //console.log('item to update: ' + selectedMenuItem._id);
    }

    const saveNewItem = () => {
        if (!menuItem.title || !menuItem.title.english) {
            setValidationMessage('Title is required!.');
            return;
        }
        if (!menuItem.link) {
            setValidationMessage('Link is required!.');
            return;
        }
       
        setValidationMessage('');

        let cloned = JSON.parse(JSON.stringify(menuItem));
        cloned.menu = menuId;
        //console.log('item to update: ' + cloned._id);
        if (!cloned._id) {
            createNavigationMenuItem(cloned).then(res => {
                console.log(res.data);
                setMenuItem(null);
                reload();
            }).catch(e => {
                console.log(e);
            });
        } else {
            updateNavigationMenuItem(cloned).then(res => {
                console.log(res.data);
                setMenuItem(null);
                reload();
            }).catch(e => {
                console.log(e);
            });
        }



    }


    const reorderItems = (itemId, newOrder, save) => {
     
        reorderMenuItems({itemId: itemId,newOrder: newOrder }).then(res => {
            reload();
        });
        


    }

    const saveAndReload = (updatedObject) => {
        updateNavigationMenu(updatedObject).then(res => {
            // console.log(res);
            setMenu(res);
        }).catch(e => {
            console.log(e);
        });
    }

    const deleteMenuItem = (itemId) => {
        setItemToDelete(itemId);
    }


    const deleteItemConfirmed = () => {
        let cloned = JSON.parse(JSON.stringify(menu));
        cloned.items = cloned.items.filter(mi => mi._id != itemToDelete);
        setMenu(cloned);
        setItemToDelete('');
        saveAndReload(cloned);

    }
 
    /*---------- Drag & Drop --------------------------*/
    const dragstart_handler = (event) => {
        console.log("dragstart: event.target.id = " + event.target.id);
        event.dataTransfer.setData("id", event.target.id);
        //event.dataTransfer.setData("order", event.target.getAttribute("order"));
       // alert("new Order - drop: " + event.target.getAttribute("order"))
        event.dataTransfer.effectAllowed = "move";
    }

    const dragend_handler = (event) => {
        //console.log("============================= DRAG END ====================== ");
        event.preventDefault();
        setDragTo(-1);
        var id = event.dataTransfer.getData("id");
        //var order = event.dataTransfer.getData("order");
        //console.log("dragend: moved item id = " + id);
        // console.log("dragend: moved item order = " + order);
        // event.target.appendChild(document.getElementById(data));
        // console.log("dragend new order: " + event.target.getAttribute("order"));

       // reorderItems(id, event.target.getAttribute("order"), true);



    }


    const dragover_handler = (event) => {
        event.preventDefault();
       // var id = event.dataTransfer.getData("id");
        var order = event.dataTransfer.getData("order");
        //console.log("dragover: moved item id = " + id);
        //console.log("dragover: moved item order = " + order);
        // event.target.appendChild(document.getElementById(data));
        // console.log(event.target);
        // console.log("dragover -> new order: " + event.target.getAttribute("order"));
        if (order != event.target.getAttribute("order")) {
            setDragTo(event.target.getAttribute("order"));
        }


        // reorderItems(id, event.target.getAttribute("order"), false);

    }



    const drop_handler = (event) => {
        console.log("============================= DROPPED ====================== ");
        event.preventDefault();
        // setDragTo(-1);
         var id = event.dataTransfer.getData("id");
        // var order = event.dataTransfer.getData("order");
        // console.log("drop: moved item id = " + id);
        // console.log("drop: moved item order = " + order);
        // // event.target.appendChild(document.getElementById(data));
        // console.log("drop new order: " + event.target.getAttribute("order"));

        // reorderItems(id, event.target.getAttribute("order"), true);

        reorderItems(id, dragTo, true);

    }


    const updateItemType = (event) => {
        let cloned = JSON.parse(JSON.stringify(menuItem));
        cloned.itemType = event.target.value;
        setMenuItem(cloned);
    }

    const updateArticleId = (event) => {
        let cloned = JSON.parse(JSON.stringify(menuItem));
        cloned.article = event.target.value;
        let article = articles.filter(a => a._id == event.target.value);
        if(article && article.length > 0){
            cloned.link = "/page/" + article[0].alias;
        }
        setMenuItem(cloned);
    }

    return (<>
        <div className="card">
            <div className="card-body">
                <div className='row'>
                    <div className='col'>
                        <h5 className="card-title">{t("dashboard.editMenu")}: <b> {menu ? getLocalizedText(menu.title, i18n) : ''} </b></h5>
                    </div>
                    <div className='col text-center'>
                        <ThreeDots
                            type="ThreeDots"
                            color="#00BFFF"
                            height={30}
                            width={100}
                            visible={loading}

                        />
                    </div>
                    <div className='col'>
                        <br /><br />
                    </div>
                </div>




                <form>
                    <div className='row'>
                        <div className='col-6'>

                            <div className='col-12 '>
                                <button type='button' className='add-btn' onClick={() => { createMenuItem(); }} >
                                    <MdPlaylistAdd size={24} /> {t("navigationMenu.addNewItem")}
                                </button>
                            </div>
                            <div className='col-12 p-3' >
                                <div order={0} onDragOver={dragover_handler}
                                    style={dragTo == 0 ? { height: '40px', border: 'solid 2px blue' } : { height: '1px' }}
                                    onDrop={drop_handler}>

                                </div>
                                {menu && menu.items ? (<>
                                    {menu.items.map(item => (<div
                                        key={item._id}
                                        id={"" + item._id}
                                        order={(parseInt(item.order))}
                                        draggable="true"
                                        onDragStart={dragstart_handler}
                                        onDragEnd={dragend_handler}
                                    >
                                        <div
                                            className='card mb-2'
                                            style={{ border: 'solid 1px #eee !important' }}


                                        >
                                            <div className="card-body" style={{ paddingTop: '0px', paddingBottom: '0px' }} >
                                                <div className='row flex-grow-1 justify-content-center align-items-center' >
                                                    <div className='' >
                                                        <MdDragIndicator size={30} color={'#aaa'} />
                                                        <input type='checkbox' className='px-2'
                                                            checked={item.published}
                                                            id={'item_' + item._id}
                                                            onChange={(event) => { updatePublished(event, item); }} style={{ cursor: 'pointer' }} />
                                                    </div>

                                                    <div className='col' >
                                                        <label htmlFor={'item_' + item._id}>
                                                            {getLocalizedText(item.title, i18n)}
                                                        </label>

                                                    </div>
                                                    <div className='col' style={{ textAlign: 'end', paddingLeft: '0px', paddingRight: '0px' }}
                                                        order={(parseInt(item.order))}>

                                                        <button type='button' className='btn btn-sm btn-default' onClick={() => { createSubItem(item) }}>
                                                            <MdPlaylistAdd size={30} color={'#aaa'} />
                                                        </button>

                                                        <button type='button' className='btn btn-sm btn-default' onClick={() => { deleteMenuItem(item._id) }}>
                                                            <MdDeleteForever size={30} color={'#aaa'} />
                                                        </button>

                                                        <button type='button' className='btn btn-sm btn-default' onClick={() => { selectToEdit(item) }}>
                                                            <MdOutlineModeEditOutline size={30} color={'#aaa'} />
                                                        </button>

                                                    </div>
                                                </div>


                                            </div>
                                        </div>
                                        {item.items ? (
                                            <div className='' >
                                                {item.items.map(subItem => (
                                                    <div key={subItem._id}
                                                        id={"" + subItem._id}
                                                        order={(parseInt(subItem.order))}
                                                        className='card mb-2 ml-5'
                                                        style={{ border: 'solid 1px #eee !important' }}
                                                        draggable="true"
                                                        onDragStart={dragstart_handler}
                                                        onDragEnd={dragend_handler}

                                                    >
                                                        <div className="card-body" style={{ paddingTop: '0px', paddingBottom: '0px' }} >
                                                            <div className='row flex-grow-1 justify-content-center align-items-center' >
                                                                <div className='' >
                                                                    <MdDragIndicator size={30} color={'#aaa'} />
                                                                    <input type='checkbox' className='px-2'
                                                                        checked={subItem.published}
                                                                        id={'item_' + subItem._id}
                                                                        onChange={(event) => { updateSubItemPublished(event, subItem); }} style={{ cursor: 'pointer' }} />
                                                                </div>

                                                                <div className='col' >
                                                                    <label htmlFor={'item_' + subItem._id}>
                                                                        {getLocalizedText(subItem.title, i18n)}
                                                                    </label>

                                                                </div>
                                                                <div className='col' style={{ textAlign: 'end', paddingLeft: '0px', paddingRight: '0px' }}
                                                                    order={(parseInt(subItem.order))}>


                                                                    <button type='button' className='btn btn-sm btn-default' onClick={() => { deleteMenuItem(subItem._id) }}>
                                                                        <MdDeleteForever size={30} color={'#aaa'} />
                                                                    </button>

                                                                    <button type='button' className='btn btn-sm btn-default' onClick={() => { selectToEdit(subItem) }}>
                                                                        <MdOutlineModeEditOutline size={30} color={'#aaa'} />
                                                                    </button>

                                                                </div>
                                                            </div>


                                                        </div>
                                                    </div>
                                                ))}
                                            </div>) : null}
                                        <div id={"drop_" + item._id} onDragOver={dragover_handler} order={(parseInt(item.order))} 
                                        style={dragTo == item.order ? { height: '40px', border: 'solid 2px blue' } : { height: '5px' }} 
                                        onDrop={drop_handler}>

                                        </div>
                                    </div>))}

                                </>
                                ) : null}
                            </div>

                        </div>

                        <div className='col-6'>
                            {menuItem ? (
                                <div className='card'>
                                    <div className="card-body">
                                        {menuItem.parentItem ? (
                                            <div className="mb-3">
                                                <label className="form-label">Parent Item: <span className='text-warning'>{getLocalizedText(menuItem.parentItem.title, i18n)} </span></label>

                                            </div>

                                        ) : null}


                                        <div className="mb-3">
                                            <label htmlFor="menuItemType" className="form-label">{t("navigationMenu.itemType")} </label>
                                            <select className="form-control" id="menuItemType" onChange={updateItemType} value={menuItem.itemType} >
                                                <option value="0">External Link</option>
                                                <option value="1">Article</option>
                                            </select>
                                        </div>

                                        {menuItem.itemType==="1"?(
                                            <div className="mb-3">
                                            <label htmlFor="article" className="form-label">{t("article.article")} </label>
                                            <select className="form-control" id="article" onChange={updateArticleId} value={menuItem.article} >
                                                <option value="">Select Article</option>
                                                {articles?articles.map(article => (<option key={article._id} value={article._id}>{getLocalizedText(article.title, i18n)}</option>)):null}
                                                <option value="1">Article</option>
                                            </select>
                                        </div>
                                        ):null}

                                        <div className="mb-3">
                                            <label htmlFor="menuItemUrl" className="form-label">{t("navigationMenu.url")} </label>
                                            <input type='text' className="form-control" id="menuItemUrl" value={menuItem.link} onChange={updateLink} />
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="menuItemLinkTarget" className="form-label">{t("navigationMenu.target")} </label>
                                            <select className="form-control" id="menuItemLinkTarget" >
                                                <option value="_self">_self: in the same frame as it was clicked</option>
                                                <option value="_blank">_blank: in a new window or tab</option>
                                                <option value="_parent">_parent: in the parent frame</option>
                                                <option value="_top">_top: in the full body of the window</option>

                                            </select>
                                        </div>



                                        <div className="mb-3">
                                            <label htmlFor="title" className="form-label">{t("dashboard.title")} </label>
                                            <LocalizedTextEditor placeholder={t("dashboard.title")} locale={contentLocale} textObject={menuItem.title}
                                                onLocalChanged={changeLocale} onChange={updateItemTitle} />
                                        </div>

                                        {validationMessage ? (
                                            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                                                <strong>Error: </strong> {validationMessage}
                                                <button type="button" class="close" data-dismiss="alert" aria-label="Close" onClick={() => setValidationMessage('')}>
                                                    <span aria-hidden="true" >&times;</span>
                                                </button>
                                            </div>

                                        ) : null}



                                        <div className="mb-3 row col justify-content-end" >
                                            <button type="button" className="btn btn-danger mx-3" onClick={cancelMenuItem}>
                                                <MdClose />
                                                {t("dashboard.cancel")}
                                            </button>
                                            <button type="button" className="btn btn-primary" onClick={saveNewItem}><MdSave /> {t("dashboard.save")}</button>
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                        </div>

                    </div>











                </form>
            </div>


        </div>


        <div className="card mt-3">
            <div className="card-body" style={{ textAlign: 'end' }}>
                <div className='row'>
                    <div className='col' style={{ textAlign: 'start' }}>
                        {itemToDelete || subItemToDelete ? (<> Are you sure you want to delete Item ? &nbsp;&nbsp;
                            {itemToDelete ? (<button type='button' className='btn btn-default text-danger' onClick={deleteItemConfirmed}><MdOutlineCheck /> YES </button>) : null}
                            {subItemToDelete ? (<button type='button' className='btn btn-default text-danger' onClick={deleteItemConfirmed}><MdOutlineCheck /> YES </button>) : null}
                            <button type='button' className='btn btn-default text-success' onClick={() => { setItemToDelete(''); setSubItemToDelete('') }}>
                                <MdClose /> NO </button></>) : null}

                    </div>
                    <div className='col'>
                        <Link to={'/admin/navigation-menus'} className="btn btn-danger mx-2" onClick={saveNewItem}>
                            <MdClose size={24} />
                            {t("close")}
                        </Link>
                    </div>
                </div>




            </div>
        </div>
    </>
    );


}

export default EditNavigationMenu;