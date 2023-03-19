import React,{ useState, useEffect } from 'react'
import { InputGroup, FormControl } from 'react-bootstrap'

const LocalizedTextAreaEditor = (props) => {
   
    const getLocalizedValue = () => {
        let result = '';
        if(!props.textObject){
            return '';
        }
        if(props.locale === 'en'){
            result = props.textObject.english;
        }else if(props.locale === 'ar'){
            result = props.textObject.arabic;
        }else if(props.locale === 'tr'){
            result = props.textObject.turkish;
            
        }
        return result;
    }

    const [displayText, setDisplayText] = useState(getLocalizedValue());

    const languages = [
        {
            code:'en',
            name:'English'
        },
        {
            code: 'ar',
            name:'العربية'
        },
        {
            code: 'tr',
            name: 'Türk'
        }
        
        
    ];
   
    
   

    

    useEffect(() => {
        setDisplayText(getLocalizedTextValue());
        //setLocale(props.locale);
         //getLocalizedString(props.textObject,'en');
     }, [props]);


    
    const changeLocale = (event) => {
        //console.log('new Locale :' + event.target.value);
        if(props.onLocalChanged){
            props.onLocalChanged(event.target.value);
        }
       // setLocale(event.target.value);
       setDisplayText(getLocalizedTextValue());
        
        
       
    }

    const textChanged = (event) => {
        //console.log('textChanged to ' + event.target.value);
        setDisplayText(event.target.value);
        if(props.onChange){
            props.onChange(event.target.value, props.locale);
        }
        
    }

    const getLocalizedTextValue = () => {
        let result ='';
        if(!props.textObject){
            return '';
        }
        if(props.locale == 'en')
        {
            result =  props.textObject.english;
        }else if(props.locale == 'ar'){
            result =  props.textObject.arabic;
        }else if(props.locale == 'tr'){
            result =  props.textObject.turkish;
        }
        if(!result){
            result = '';
        }

        return result;
        
    }

    

    return (<>

        <div className="row">

           
            <div className="col">
                <textarea id="localizedText" className="form-control" placeholder={props.placeholder} value={displayText} 
                onChange={textChanged} rows={props.rows?props.rows:3} >{displayText}</textarea>
            </div>
            <div className="col col-2">
                <select className="me-sm-2 form-select form-control" id="inlineFormCustomSelect" value={props.locale} onChange={changeLocale}>
                
                    {
                        languages.map(lang => (<option key={lang.code} value={lang.code}> {lang.name} </option>))
                    }
                   
                  
                </select>
            </div>
        </div>
    </>);
}

export default LocalizedTextAreaEditor;