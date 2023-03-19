import React,{ useState, useEffect } from 'react'
import { useTranslation } from "react-i18next"
import { MdPoll } from "react-icons/md"
import { getCounters, updateCounter } from './CountersAPI'
import { toast } from 'react-toastify'

const ListCounters = () => {
    const [counters, setCounters] = useState({});

    const { t } = useTranslation();

    useEffect(() => {
        getCounters().then(res => {
            if(res.data != null && res.data.length > 0){
            setCounters(res.data[0]);
            }
        });
    }, []);

    const doPost = () => {
        updateCounter(counters).then(res => {
            console.log(res.data);
            toast.success(t("succeed"));
        })
    }

    const updatePartners = event => {
        let cloned = JSON.parse(JSON.stringify(counters));
        cloned.partners = parseInt(event.target.value);
        setCounters(cloned);
    }
    const updateProjects = event => {
        let cloned = JSON.parse(JSON.stringify(counters));
        cloned.projects = parseInt(event.target.value);
        setCounters(cloned);
    }
    const updatePrograms = event => {
        let cloned = JSON.parse(JSON.stringify(counters));
        cloned.programs = parseInt(event.target.value);
        setCounters(cloned);
    }
    const updateBeneficiaries = event => {
        let cloned = JSON.parse(JSON.stringify(counters));
        cloned.beneficiaries = parseInt(event.target.value);
        setCounters(cloned);
    }

    return (
        <div className="conatiner">
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title"><MdPoll /> {t("sidebar.counters")}</h5>
                    <br />
                    <form>
                        <div className="mb-3">
                            <label htmlFor="partners" className="form-label">{t("partnersCount")} </label>
                            <input type="text" className="form-control" id="partners" value={counters.partners} onChange={updatePartners} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="projects" className="form-label">{t("projectsCount")} </label>
                            <input type="text" className="form-control" id="projects" value={counters.projects} onChange={updateProjects} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="programs" className="form-label">{t("programsCount")} </label>
                            <input type="text" className="form-control" id="programs" value={counters.programs} onChange={updatePrograms} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="beneficiaries" className="form-label">{t("beneficiariesCount")} </label>
                            <input type="text" className="form-control" id="beneficiaries" value={counters.beneficiaries} onChange={updateBeneficiaries} />
                        </div>
                        <div className="col text-end" >
                            <button type="button" className="btn btn-primary" onClick={doPost}>{t("dashboard.save")}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ListCounters;