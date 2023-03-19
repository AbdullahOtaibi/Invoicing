import React, { useState, useEffect } from 'react'
import { getQueuedMessage, removeMailTemplate } from './CommunicationsAPI'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from "react-i18next"
import { MdMarkEmailRead, MdMarkEmailUnread, MdOutlineWifiTetheringErrorRounded, MdOutlineContactMail } from "react-icons/md";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "react-loader-spinner";
import { getLocalizedText } from '../utils/utils'
import { hasPermission } from '../utils/auth';
import Moment from 'react-moment'

const MessageQueueItem = (props) => {

    const [message, setMessage] = useState({});
    const [loading, setLoading] = useState(false);
    const { t, i18n } = useTranslation();
    const { id } = useParams();

    useEffect(() => {
        setMessage(props.selectedMessage);
    }, [props.selectedMessage]);
   


    return (
        <div className="conatiner">
            <div className="card">
                <div className="card-body">


                    <div className='row'>
                        <div className='col'>
                            <h5 className="card-title">
                                {message.sent == true ? (<MdMarkEmailRead size={24} className="text-dark" />) : (
                                    <MdMarkEmailUnread size={24} className="text-dark" />)}
                                &nbsp;
                                {message && message.sent == false && message.retries > 0 ? (
                                    <><MdOutlineWifiTetheringErrorRounded className='text-danger' title={"failed"} />
                                        &nbsp;
                                    </>

                                ) : null}

                                {message.subject}
                                {message.sender?(<>
                                <br/> <span><MdOutlineContactMail size={22} className="text-dark" /> &nbsp; </span> {message.sender.firstName + ' ' + message.sender.surName}</>):null}

                            </h5>
                        </div>
                        <div className='col col-auto text-end'>
                            <span className='font-weight-normal text-uppercase' style={{ fontSize: '12px' }}>
                                <Moment date={message.dateAdded} format="ddd DD/MM/YYYY hh:mm a" />
                            </span>
                            <br />


                        </div>

                    </div>


                    <div className="container text-center">
                        <Loader
                            type="ThreeDots"
                            color="#00BFFF"
                            height={100}
                            width={100}
                            visible={loading}
                        />
                    </div>



                    <div className='container'>
                        <div className='row mb-3'>
                            <div className='col-12'>

                                <hr />
                            </div>
                        </div>

                        <div className='row'>
                            <div className='col-12'>
                                <p dangerouslySetInnerHTML={{ __html: message.messageBody }}>

                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



        </div>
    )
}


export default MessageQueueItem;