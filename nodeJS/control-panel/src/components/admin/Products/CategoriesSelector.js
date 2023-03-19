import React, { useState, useEffect, useRef } from 'react'
import { useTranslation } from "react-i18next"
import { getLocalizedText, getLocalizedTextByLocale } from '../utils/utils'
import { RiDeleteBin2Line } from 'react-icons/ri'
const CategoriesSelector = ({ availableCategories, selectedCategories, updateSelected }) => {
    const { t, i18n } = useTranslation();
    const [selectedMain, setSelectedMain] = useState(0);
    const [selectedSub, setSelectedSub] = useState(0);
    const [selectedList, setSelectedList] = useState(selectedCategories || []);

    const selectCat = (cat) => {
        let cloned = JSON.parse(JSON.stringify(selectedList));
        cloned.push(cat);
        setSelectedList(cloned);
        if (updateSelected) {
            updateSelected(cloned);
        }
    }

    const removeCat = (cat) => {
        let cloned = JSON.parse(JSON.stringify(selectedList));
        cloned = cloned.filter(c => c._id != cat._id);
        setSelectedList(cloned);
        if (updateSelected) {
            updateSelected(cloned);
        }
    }

    useEffect(() => {

        setSelectedList(selectedCategories);
        //updateSelected
    }, [selectedCategories]);


    return (<>
        <h4>Categories ({selectedList.length})</h4>

        <div className='row'>
            <div className='col p-1 col-auto'>
                <div className="btn-group-vertical" role="group" aria-label="Button group with nested dropdown">

                    {availableCategories.filter(c => c.parent == null && c.published == true).map(cat => (
                        <button type='button' className='btn btn-primary' key={cat._id} style={{ margin: '1px' }}
                            value={cat._id} onClick={() => { setSelectedMain(cat._id); setSelectedSub(0); }}>
                            {getLocalizedText(cat.name, i18n)} &gt;
                        </button>))}
                </div>
            </div>

            <div className='col p-1 col-auto'>
                <div className="btn-group-vertical" role="group" aria-label="Button group with nested dropdown">

                    {availableCategories.filter(c => c.parent == selectedMain && c.published == true).map(cat => (
                        <button type='button' className='btn btn-outline-primary' key={cat._id} style={{ margin: '1px' }}
                            value={cat._id} onClick={() => { setSelectedSub(cat._id); }}>
                            {getLocalizedText(cat.name, i18n)} &gt;
                        </button>))}
                </div>
            </div>

            <div className='col p-1 col-auto'>
                <div className="btn-group-vertical" role="group" aria-label="Button group with nested dropdown">

                    {availableCategories.filter(c => c.parent == selectedSub && c.published == true && selectedList.filter(s => s._id == c._id).length == 0).map(cat => (
                        <button type='button' className='btn btn-outline-success' key={cat._id} style={{ margin: '1px' }}
                            value={cat._id} onClick={() => { selectCat(cat); }}>
                            + {getLocalizedText(cat.name, i18n)} </button>))}
                </div>


            </div>

            <div className='col col-6 p-x-3' style={{ border: 'dashed 2px green' }}>

                <div className='row'>
                    <div className='col'>
                        <h4>Selected Categories</h4>
                        <hr />
                    </div>
                </div>
                {selectedList.map(cat => (
                    <button type='button' className='btn btn-danger' key={cat._id} style={{ margin: '1px' }}
                        value={cat._id} onClick={() => { removeCat(cat) }}>
                        <RiDeleteBin2Line size={30} /> {getLocalizedText(cat.name, i18n)} </button>))}


            </div>
        </div>




    </>);
}


export default CategoriesSelector;