import React,{ useState, useEffect } from 'react';
import { getMenu, updateMenu } from './MenusAPI'
import { useTranslation } from "react-i18next"
import { MdEdit, MdDelete, MdAdd } from "react-icons/md";
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom';


const EditMenu = (props) => {
  const [menu, setMenu] = useState({ items: [] });
  const [menuItem, setMenuItem] = useState({});
  const { menuId } = useParams();
  const { t } = useTranslation();

  useEffect(() => {
    getMenu(menuId).then(res => {
      console.log("MENU ITEMS =================");
      console.log(res.data);
      if (res.data.items == null) {
        res.data.items = [];
      }
      setMenu(res.data);
    });
  }, []);

  const updateTitle = (event) => {
    let cloned = JSON.parse(JSON.stringify(menuItem));
    cloned.title = event.target.value;
    setMenuItem(cloned);
  }
  const updateTitleArabic = (event) => {
    let cloned = JSON.parse(JSON.stringify(menuItem));
    cloned.titleArabic = event.target.value;
    setMenuItem(cloned);
  }

  const updateLink = (event) => {
    let cloned = JSON.parse(JSON.stringify(menuItem));
    cloned.link = event.target.value;
    setMenuItem(cloned);
  }

  
  const updatePublished = (event) => {
    let cloned = JSON.parse(JSON.stringify(menuItem));
    cloned.published = event.target.checked;
    setMenuItem(cloned);
  }


  const editItem = (selectedItem) => {
    console.log(selectedItem);
    setMenuItem(selectedItem);
  }

  const crateNewItem = () => {
    return { title: "new", titleArabic: "new", link: "/page/", published: false };
  }
  const addItem = (parent) => {
    let newItem = crateNewItem();
    let cloned = JSON.parse(JSON.stringify(menu));
    let level1Item = cloned.items.filter(item => item.id == parent.id)[0];
    if (level1Item) {

      level1Item.childs.push(newItem);
    } else {

      cloned.items.forEach(item => {
        item.childs.forEach(child => {
          if (child.id == parent.id) {
            child.childs.push(newItem);
          } else {
            child.childs.forEach(child2 => {
              if (child2.id == parent.id) {
                child2.childs.push(newItem);
              }
            })
          }
        })

      });

    }

    setMenuItem(newItem);
    setMenu(cloned);

  }

  const removeItem = (selectedItem) => {

  }

  const clearItem = () => {
    console.log("Clear Form ...");
    setMenuItem({ id: 0, title: "", titleArabic: "", link: "", published: false });
  }

  const updateSelectedItem = () => {

    let cloned = JSON.parse(JSON.stringify(menu));
    let level1Item = cloned.items.filter(item => item.id == menuItem.id)[0];
    if (level1Item) {
      updateItem(level1Item);
    } else {

      cloned.items.forEach(item => {
        item.childs.forEach(child => {
          if (child.id == menuItem.id) {
            updateItem(child);
          } else {
            child.childs.forEach(child2 => {
              if (child2.id == menuItem.id) {
                updateItem(child2);
              }
            })
          }
        })

      });

    }
    setMenu(cloned);
    updateMenu(cloned).then(res => {
      setMenuItem({ id: 0, title: "", titleArabic: "", link: "", published: false });
      toast.success(t("succeed"));
    });

  }

  const updateItem = (item) => {
    item.title = menuItem.title;
    item.titleArabic = menuItem.titleArabic;
    item.link = menuItem.link;
    item.published = menuItem.published;
  }


 


  return (
    <div style={{ minHeight: 400 }}>
      <h1 className="card-title">{t("dashboard.editMenu")}</h1>
      <div className="row">
        <div className="col">
          <div className="table-responsive">
            <table className="table   table-borderless">
              {menu.items.map(item => (<>
                <tr>
                  <td>
                    <button className="btn btn-sm btn-primary" onClick={() => editItem(item)}> <MdEdit /></button>
                    &nbsp;
                    <button className="btn btn-sm btn-success" onClick={() => addItem(item)}><MdAdd /></button>
                    &nbsp;
                    <button className="btn btn-sm btn-danger" onClick={() => removeItem(item)}><MdDelete /></button>
                  </td>
                  <td colSpan="4" style={{ borderRight: 'solid 0px #000', backgroundColor: 'lightGray' }}>
                    <a onClick={() => editItem(item)} href="#">
                      {item.titleArabic}
                    </a>
                  </td>
                </tr>
                {item.childs ? item.childs.map(child => (<>
                  <tr>
                    <td>
                      <button className="btn btn-sm btn-primary" onClick={() => editItem(child)}> <MdEdit /></button>
                      &nbsp;
                      <button className="btn btn-sm btn-success" onClick={() => addItem(child)}><MdAdd /></button>
                      &nbsp;
                      <button className="btn btn-sm btn-danger" onClick={removeItem}><MdDelete /></button>
                    </td>
                    <td></td>
                    <td style={{ borderRight: 'solid 1px #00f', paddingRight: 0, paddingLeft: 0 }}> <hr /></td>
                    <td style={{}}>
                      <a onClick={() => editItem(child)} href="#">
                        {child.titleArabic}
                      </a>
                    </td></tr>
                  {child.childs ? child.childs.map(child2 => (<>
                    <tr>
                      <td>
                        <button className="btn btn-sm btn-primary" onClick={() => editItem(child2)}> <MdEdit /></button>
                        &nbsp;
                        <button className="btn btn-sm btn-success" onClick={() => addItem(child2)}><MdAdd /></button>
                        &nbsp;
                        <button className="btn btn-sm btn-danger" onClick={removeItem}><MdDelete /></button>
                      </td>
                      <td></td>
                      <td></td>

                      <td style={{ borderRight: 'solid 1px #00f', paddingRight: 0, paddingLeft: 0 }}><hr /></td>



                      <td>
                        <a onClick={() => editItem(child2)} href="#">
                          {child2.titleArabic}
                        </a>
                      </td></tr>
                  </>)) : null}
                </>)) : null}
                <tr><td colSpan="6"></td></tr>
              </>
              ))}
            </table>
          </div>
        </div>
        <div className="col">
          {t("dashboard.edit")}
          <div className="table-responsive">
            <table className="table">
              <tr>
                <td>
                  {t("dashboard.title")} ({t("dashboard.arabic")})
                </td>
                <td>
                  <input type="text" className="form-control" value={menuItem.titleArabic} onChange={updateTitleArabic} />
                </td>
              </tr>

              <tr>
                <td>
                  {t("dashboard.title")} ({t("dashboard.english")})
                </td>
                <td>
                  <input type="text" className="form-control" value={menuItem.title} style={{ direction: 'ltr' }} onChange={updateTitle} />
                </td>
              </tr>

              <tr>
                <td>
                  {t("dashboard.link")}
                </td>
                <td>
                  <input type="text" className="form-control" value={menuItem.link} style={{ direction: 'ltr' }} onChange={updateLink} />
                </td>

              </tr>


              <tr>
                <td colspan="2">
                  <div className="mb-3 form-check">
                    <div className="custom-control custom-checkbox">
                      <input type="checkbox" className="custom-control-input" id="publishedCheck" checked={menuItem.published} onChange={updatePublished} />
                      <label className="custom-control-label" htmlFor="publishedCheck">{t("dashboard.published")}</label>
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <td colspan="2">
                  <button className="btn btn-danger" onClick={clearItem}>
                    {t("dashboard.cancel")}
                  </button>
                  &nbsp;
                  <button className="btn btn-primary-1" onClick={updateSelectedItem}>
                    {t("dashboard.save")}
                  </button>

                </td>
              </tr>

            </table>
          </div>
        </div>
      </div>

    </div>
  );

}


export default EditMenu;