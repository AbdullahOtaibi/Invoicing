import React, { useState, useEffect } from 'react'
import { getQueuedMessages, removeMailTemplate, deleteQueuedMessageItem } from './CommunicationsAPI'
import { Link } from 'react-router-dom'
import { useTranslation } from "react-i18next"
import { MdEdit, MdDelete, MdOutlineMarkAsUnread, MdAdd, MdMarkEmailRead, MdMarkEmailUnread, MdInbox } from "react-icons/md";
import { IoTrashOutline } from "react-icons/io5";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThreeDots } from  'react-loader-spinner';
import { getLocalizedText } from '../utils/utils'
import { hasPermission } from '../utils/auth';
import Moment from 'react-moment'
import MessageQueueItem from './MessageQueueItem'

const MessageQueue = () => {

    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState({});
    const [loading, setLoading] = useState(false);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        setLoading(true);
        getQueuedMessages().then(data => {

            setMessages(data);
            if (data && data.length > 0) {
                setMessage(data[0]);
            }
            setLoading(false);
        }).catch(e => {
            setLoading(false);
            if (e.response && e.response.status === 403) {
                window.location.href = "/admin/sign-in"
            }
            //console.log("Error : " + e.response.status);
            toast.error(e.message);
        })
    }, []);



    const deleteMailTemplates = (id) => {
        removeMailTemplate(id).then(res => {
            setMessages(messages.filter(a => a.id != id));

        });
    }

    const showMessage = (id) => {
        //alert(id);
        setMessage(messages.filter(m => m._id == id)[0])
    }

    const getClass = (id) => {
        if (id == message._id) {
            return 'table-light'
        } else {
            return ''
        }
    }

    const deleteMessage = () => {
        let messageIdToDelete = message._id;
        deleteQueuedMessageItem(messageIdToDelete).then(res => {
            setMessages(messages.filter(m => m._id != messageIdToDelete));
            setMessage({ _id: null })
        }).catch(e => {
            console.log(e);
        });
    }

    return (
        <div className="conatiner">
            <div className="card">
                <div className="card-body">


                    <div className='row'>
                        <div className='col-md-8 col-sm-6'>
                            <h5 className="card-title"><MdOutlineMarkAsUnread /> {t("communications.messageQueue")}
                                &nbsp;
                            </h5>
                        </div>

                        <div className='col-md-4 col-sm-6' style={{ textAlign: 'end' }}>
                            {message && message._id ? (
                                <button type='button' className='btn btn-default' onClick={deleteMessage}>
                                    <IoTrashOutline size={24} /> Delete
                                </button>

                            ) : null}

                        </div>
                    </div>


                    <div className="container text-center">
                        <ThreeDots
                            type="ThreeDots"
                            color="#00BFFF"
                            height={100}
                            width={100}
                            visible={loading}
                        />
                    </div>
                    <br />
                    <div className="row">
                        <div className='col-4 px-0'>
                            <div className="table-responsive">
                                <table className="table   table-hover">
                                    {/* <thead>
                                        <tr>
                                            <th>
                                            </th>
                                        </tr>
                                    </thead> */}
                                    <tbody>
                                        {
                                            messages && messages.length > 0 ? (messages.map(item => (
                                                <tr key={item._id} className={getClass(item._id)}>
                                                    <td>
                                                        <div className='row'>
                                                            <div className='col' >
                                                                {item.recipients[0]}
                                                                <br />

                                                                <Link to={"#"} onClick={() => { showMessage(item._id) }}>
                                                                    <span className="d-inline-block text-truncate" style={{ maxWidth: '100%' }}

                                                                    >
                                                                        {item.sent == true ? (<MdMarkEmailRead size={24} className="text-dark" />) : (
                                                                            <MdMarkEmailUnread size={24} className="text-dark" />)}
                                                                        &nbsp;
                                                                        {item.subject}
                                                                    </span>
                                                                </Link>
                                                            </div>
                                                            <div className='col col-auto text-center'>
                                                                <span className='' style={{ fontSize: '12px' }}>
                                                                    <Moment date={item.dateAdded} format="ddd DD/MM" />

                                                                </span>
                                                                <br />


                                                            </div>
                                                        </div>

                                                    </td>




                                                </tr>
                                            ))) : (
                                                <tr>
                                                    <td className="text-dark">
                                                        <MdInbox size={20} /> &nbsp; No Messages
                                                    </td>
                                                </tr>
                                            )
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className='col-8'>

                            {message && message._id != null ? (<MessageQueueItem selectedMessage={message} />) : (<>
                                <div className='row'>
                                    <div className='col-12 text-center text-dark'>
                                        <br /><br /><br />
                                        <img src="/images/inbox.svg" width="200" alt="No Message Selected" />
                                        <br />
                                        Select a message to display
                                    </div>
                                </div>
                            </>)}

                        </div>
                    </div>

                </div>
            </div>




        </div>
    )
}


export default MessageQueue;