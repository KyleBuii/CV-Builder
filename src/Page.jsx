import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import React, { memo, useEffect, useRef, useState } from 'react';
import { FaDownload } from 'react-icons/fa';
import { FaPencil, FaTrashCan } from 'react-icons/fa6';

let clickedElement = <></>;

const Page = ({ values, setters }) => {
    const [pageLoaded, setPageLoaded] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [deleteMode, setDeleteMode] = useState(false);

    const refPrint = useRef();

    useEffect(() => {
        const allStrings = [values.name, values.location, values.phone, values.email, values.github];
        const longestString = Math.max(...allStrings.map((string) => string.length));
        const delay = (longestString * 50) + 300;

        const timeout = setTimeout(() => {
            setPageLoaded(true);
        }, delay);

        return () => {
            clearTimeout(timeout);
        };
    }, []);

    const renderWord = (label, word) => {
        return [...word].map((char, index) => {
            return <span key={`${label}-${index}`}
                className='animation-add-text'
                style={{ animationDelay: (!pageLoaded) ? `${index * 0.05}s` : '' }}
                tabIndex={-1}>
                {(char === ' ') ? '\u00A0' : char}
            </span>
        });
    };

    const handleDownload = async () => {
        const element = refPrint.current;
        element.classList.add('no-animation');

        const canvas = await html2canvas(element, {
            scale: 2
        });
        const data = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: [canvas.width, canvas.height],
        });

        pdf.addImage(data, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save('resume.pdf');
    };

    const handleStateChange = (name, value, setValue) => {
        setValue(!value);

        switch (name) {
            case 'edit':
                if (deleteMode) setDeleteMode(false);
                break;
            case 'delete':
                if (editMode) setEditMode(false);
                break;
            default: break;
        };
    };

    const handleResumeClick = (event) => {
        const elementDataName = event.target.getAttribute('data-name');
        if (elementDataName === null) return;

        const capitalizedDataName = `${elementDataName.charAt(0).toUpperCase()}${elementDataName.slice(1)}`;
        const elementDataSubName = event.target.getAttribute('data-sub-name');
        const elementDataIndex = event.target.getAttribute('data-index');
        const elementDataIndexItem = event.target.getAttribute('data-index-item');
        let value = values[elementDataName];

        clickedElement = event.target;

        if (editMode) {
            const elementInput = document.getElementById('page-floating-input');
            const rect = event.target.getBoundingClientRect();
            const style = {
                x: rect.left + window.scrollX,
                y: rect.top + window.scrollY,
                width: rect.width,
                height: rect.height,
            };

            switch (elementDataName) {
                case 'degree':
                case 'experiences':
                case 'projects': {
                    const objectKey = Object.keys(value)[elementDataIndex];

                    switch (elementDataSubName) {
                        case 'name': {
                            value = objectKey;
                            break;
                        };
                        case 'information': {
                            value = value[objectKey].information[elementDataIndexItem];
                            break;
                        };
                        default: {
                            value = value[objectKey][elementDataSubName];
                            break;
                        };
                    };
                    break;
                };
                case 'achievements':
                case 'courses':
                case 'technicalSkills':
                case 'languages': {
                    value = value[elementDataSubName];
                    break;
                };
                default: { break; };
            };

            elementInput.value = value;

            elementInput.style.display = 'block';
            elementInput.style.transform = `translate(${style.x}px, ${style.y}px)`;
            elementInput.style.width = `${style.width}px`;
            elementInput.style.height = `${style.height}px`;
            elementInput.focus();
        };

        if (deleteMode) {
            const setter = setters[`set${capitalizedDataName}`];

            switch (elementDataName) {
                case 'degree':
                case 'experiences':
                case 'projects': {
                    const newObject = { ...value };
                    const objectKey = Object.keys(newObject)[elementDataIndex];

                    switch (elementDataSubName) {
                        case 'name': {
                            const copyObject = { ...newObject[objectKey] };

                            switch (elementDataName) {
                                case 'degree':
                                    setter({ '': copyObject });
                                    break;
                                case 'experiences':
                                case 'projects':
                                    delete newObject[objectKey];
                                    setter({ ...newObject, '': copyObject });
                                    break;
                                default:
                                    break;
                            }
                            break;
                        };
                        case 'information': {
                            const newInfo = [...newObject[objectKey].information];
                            newInfo.splice(elementDataIndexItem, 1);

                            setter({
                                ...newObject,
                                [objectKey]: {
                                    ...newObject[objectKey],
                                    information: newInfo,
                                },
                            });
                            break;
                        };
                        default: {
                            setter({
                                ...newObject,
                                [objectKey]: {
                                    ...newObject[objectKey],
                                    [elementDataSubName]: '',
                                },
                            });
                            break;
                        };
                    };
                    break;
                };
                case 'achievements':
                case 'courses':
                case 'technicalSkills':
                case 'languages': {
                    const newArray = [...value];
                    newArray.splice(elementDataSubName, 1);
                    setter(newArray);
                    break;
                };
                default: {
                    setter('');
                    break;
                };
            };
        };
    };

    const handleInputEditKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleInputBlur();
        };
    };

    const handleInputBlur = () => {
        const elementInput = document.getElementById('page-floating-input');
        elementInput.style.display = 'none';
        
        const elementDataName = clickedElement.getAttribute('data-name');
        const elementDataSubName = clickedElement.getAttribute('data-sub-name');
        const elementDataIndex = clickedElement.getAttribute('data-index');
        const elementDataIndexItem = clickedElement.getAttribute('data-index-item');

        const elementInputValue = elementInput.value;
        const currentValue = values[elementDataName];

        if (currentValue === elementInputValue) return;

        const capitalizedDataName = `${elementDataName.charAt(0).toUpperCase()}${elementDataName.slice(1)}`;
        const setter = setters[`set${capitalizedDataName}`];

        switch (elementDataName) {
            case 'degree':
            case 'experiences':
            case 'projects': {
                const newObject = { ...currentValue };
                const objectKey = Object.keys(newObject)[elementDataIndex];

                switch (elementDataSubName) {
                    case 'name': {
                        const copyObject = { ...newObject[objectKey] };

                        switch (elementDataName) {
                            case 'degree':
                                setter({ [elementInputValue]: copyObject });
                                break;
                            case 'experiences':
                            case 'projects':
                                delete newObject[objectKey];
                                setter({ ...newObject, [elementInputValue]: copyObject });
                                break;
                            default:
                                break;
                        }
                        break;
                    };
                    case 'information': {
                        const newInfo = [...newObject[objectKey].information];
                        newInfo[elementDataIndexItem] = elementInputValue;

                        setter({
                            ...newObject,
                            [objectKey]: {
                                ...newObject[objectKey],
                                information: newInfo,
                            },
                        });
                        break;
                    };
                    default: {
                        setter({
                            ...newObject,
                            [objectKey]: {
                                ...newObject[objectKey],
                                [elementDataSubName]: elementInputValue,
                            },
                        });
                        break;
                    };
                };
                break;
            };
            case 'achievements':
            case 'courses':
            case 'technicalSkills':
            case 'languages': {
                const newArray = [...currentValue];
                newArray[elementDataSubName] = elementInputValue;
                setter(newArray);
                break;
            };
            default: {
                setter(elementInputValue);
                break;
            };
        };
    };

    return (
        <div>
            <section className='floating-buttons'>
                <h2 className='screen-reader-only'>Buttons</h2>
                <button onClick={() => handleDownload()}>
                    <FaDownload/>
                </button>
                <button id='resume-button-edit'
                    style={{ backgroundColor: (editMode) ? 'yellow' : '' }}
                    onClick={() => handleStateChange('edit', editMode, setEditMode)}>
                    <FaPencil/>
                </button>
                <button id='resume-button-delete'
                    style={{ backgroundColor: (deleteMode) ? 'red' : '' }}
                    onClick={() => handleStateChange('delete', deleteMode, setDeleteMode)}>
                    <FaTrashCan/>
                </button>
            </section>
            <input id='page-floating-input'
                onKeyDown={handleInputEditKeyDown}
                onBlur={handleInputBlur}/>
            <section className='resume'
                ref={refPrint}
                onClick={(event) => handleResumeClick(event)}>
                <h2 className='screen-reader-only'>Resume</h2>
                <section className='header'>
                    <h3 data-name='name'>{renderWord('name', values.name)}</h3>
                    <div>
                        <span data-name='location'>{renderWord('location', values.location)}</span>
                        {(values.phone !== '') && <span data-name='phone'> | P: {renderWord('phone', values.phone)}</span>}
                        {(values.email !== '') && <span data-name='email'> | {renderWord('email', values.email)}</span>}
                        {(values.github !== '') && <span data-name='github'> | GitHub: {renderWord('github', values.github)}</span>}
                    </div>
                </section>
                <section className='group'>
                    <h4>EDUCATION</h4>
                    <div className='end-to-end animation-slide-in'>
                        <span>
                            <b data-name='school'>{renderWord('school', values.school)}</b>
                        </span>
                        <span data-name='schoolLocation'>{renderWord('school-location', values.schoolLocation)}</span>
                    </div>
                    <div className='end-to-end animation-slide-in'
                        style={{ animationDelay: '0.05s' }}>
                        {(Object.keys(values.degree).length !== 0) && (() => {
                            const degreeInfo = values.degree;
                            const degreeName = Object.keys(degreeInfo)[0];
                            const { dateStart, dateEnd } = degreeInfo[degreeName] || {};

                            const allEmpty = !degreeName.trim() && !dateStart?.trim() && !dateEnd?.trim();

                            if (allEmpty) return null;

                            return (
                                <>
                                    <span key={`degree-name-${degreeName}`}
                                        className='animation-add-in'
                                        data-name='degree'
                                        data-sub-name='name'
                                        data-index='0'>{degreeName}</span>
                                    <div key={`degree-date-${degreeInfo[degreeName].dateStart})`}
                                        className='animation-add-in'>
                                        <span data-name='degree'
                                            data-sub-name='dateStart'
                                            data-index='0'>{degreeInfo[degreeName].dateStart}</span>
                                        {' '}-{' '}
                                        <span data-name='degree'
                                            data-sub-name='dateEnd'
                                            data-index='0'>{degreeInfo[degreeName].dateEnd}</span>
                                    </div>
                                </>
                            );
                        })()}
                    </div>
                    <div className='animation-slide-in'
                        style={{ animationDelay: '0.1s' }}>
                        {(values.major !== '') && <span data-name='major'>Major in {renderWord('major', values.major)}</span>}
                    </div>
                    <div className='animation-slide-in'
                        style={{ animationDelay: '0.15s' }}>
                        {values.achievements.map((achievement, index) => {
                            return <React.Fragment key={index}>
                                <span className='animation-add-in'
                                    data-name='achievements'
                                    data-sub-name={index}>{achievement};</span>
                                {' '}
                            </React.Fragment>
                        })}
                    </div>
                    <span className='animation-slide-in'
                        style={{ animationDelay: '0.2s' }}>
                        {(values.courses.length !== 0) &&
                            <div>Relevant Coursework:{' '}
                                {values.courses.map((course, index) => {
                                    return <React.Fragment key={index}>
                                        <span className='animation-add-in'
                                            data-name='courses'
                                            data-sub-name={index}>{course};</span>
                                        {' '}
                                    </React.Fragment>
                                })}
                            </div>
                        }
                    </span>
                </section>
                <section className='group'>
                    <h4>EXPERIENCE</h4>
                    {(Object.keys(values.experiences).length !== 0) && (() => {
                        return Object.keys(values.experiences).map((experience, index) => {
                            const experienceInfo = values.experiences[experience];
                            const { dateStart, dateEnd } = experienceInfo || {};
                            const infoList = experienceInfo.information || [];

                            const allInfoEmpty = infoList.every((info) => !info.trim());
                            const allEmpty = !experience?.trim() && !dateStart?.trim() && !dateEnd?.trim() && allInfoEmpty;

                            if (allEmpty) return null;

                            return (
                                <section key={experience}>
                                    <div className='end-to-end animation-slide-in'
                                        style={{ animationDelay: '0.05s' }}>
                                        <h5 data-name='experiences'
                                            data-sub-name='name'
                                            data-index={index}>{experience}</h5>
                                        <div>
                                            <span data-name='experiences'
                                                data-sub-name='dateStart'
                                                data-index={index}>{experienceInfo.dateStart}</span>
                                            {' '}-{' '}
                                            <span data-name='experiences'
                                                data-sub-name='dateEnd'
                                                data-index={index}>{experienceInfo.dateEnd}</span>
                                        </div>
                                    </div>
                                    <ul>
                                        {experienceInfo.information.map((info, indexItem) => {
                                            if (!info.trim()) return null;

                                            return <li key={`${experience}-info-${indexItem}`}
                                                className='animation-slide-in'
                                                style={{ animationDelay: '0.15s' }}
                                                data-name='experiences'
                                                data-sub-name='information'
                                                data-index={index}
                                                data-index-item={indexItem}>
                                                {info}
                                            </li>
                                        })}
                                    </ul>
                                </section>
                            );
                        });
                    })()}
                </section>
                <section className='group'>
                    <h4>PROJECTS</h4>
                    {(Object.keys(values.projects).length !== 0) && (() => {
                        return Object.keys(values.projects).map((project, index) => {
                            const projectInfo = values.projects[project];
                            const { dateStart, dateEnd } = projectInfo || {};
                            const infoList = projectInfo.information || [];

                            const allInfoEmpty = infoList.every((info) => !info.trim());
                            const allEmpty = !project?.trim() && !dateStart?.trim() && !dateEnd?.trim() && allInfoEmpty;

                            if (allEmpty) return null;

                            return <section key={project}>
                                <div className='end-to-end animation-slide-in'
                                    style={{ animationDelay: '0.05s' }}>
                                    <h5 data-name='projects'
                                        data-sub-name='name'
                                        data-index={index}>{project}</h5>
                                    <div>
                                        <span data-name='projects'
                                            data-sub-name='dateStart'
                                            data-index={index}>{projectInfo.dateStart}</span>
                                        {' '}-{' '}
                                        <span data-name='projects'
                                            data-sub-name='dateEnd'
                                            data-index={index}>{projectInfo.dateEnd}</span>
                                    </div>
                                </div>
                                <ul>
                                    {projectInfo.information.map((info, indexItem) => {
                                        if (!info.trim()) return null;

                                        return <li key={`${project}-info-${indexItem}`}
                                            className='animation-slide-in'
                                            style={{ animationDelay: '0.15s' }}
                                            data-name='projects'
                                            data-sub-name='information'
                                            data-index={index}
                                            data-index-item={indexItem}>
                                            {info}
                                        </li>
                                    })}
                                </ul>
                            </section>
                        })
                    })()}
                </section>
                <section className='group'>
                    <h4>ADDITIONAL</h4>
                    {(values.technicalSkills.length !== 0) &&
                        <div className='animation-slide-in'
                            style={{ animationDelay: '0.05s' }}>
                            <b>Technical Skills: </b>
                            {values.technicalSkills.map((skill, index) => {
                                return <React.Fragment key={index}>
                                    <span className='animation-add-in'
                                        data-name='technicalSkills'
                                        data-sub-name={index}>{skill};</span>
                                    {' '}
                                </React.Fragment>
                            })}
                        </div>
                    }
                    {(values.languages.length !== 0) &&
                        <div className='animation-slide-in'
                            style={{ animationDelay: '0.1s' }}>
                            <b>Languages: </b>
                            {values.languages.map((language, index) => {
                                return <React.Fragment key={index}>
                                    <span className='animation-add-in'
                                        data-name='languages'
                                        data-sub-name={index}>{language};</span>
                                    {' '}
                                </React.Fragment>
                            })}
                        </div>
                    }
                </section>
            </section>
        </div>
    );
};

export default memo(Page);