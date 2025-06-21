import { memo } from 'react';

const Sidebar = ({ values, setters }) => {
    const handleSubmit = (field, event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const formValues = Object.fromEntries(formData.entries());

        handleClick(field, formValues);

        event.target.reset();

        if (field === 'Degree') return;

        const bulletList = document.getElementById(`sidebar-${field.toLowerCase()}-list`);
        bulletList.innerHTML = `
            <li>
                <input name='bullet0'
                    required/>
            </li>
        `;
    };

    const handleChange = (field, value) => {
        const uncapitalizedField = `${field.charAt(0).toLowerCase()}${field.slice(1)}`;
        const valuesField = values[uncapitalizedField];
        switch (field) {
            case 'Degree':
                setters[`set${field}`]({
                    ...value,
                });
                break;
            case 'Experiences':
            case 'Projects':
                setters[`set${field}`]({
                    ...valuesField,
                    ...value,
                });
                break;
            case 'Achievements':
            case 'Courses':
            case 'TechnicalSkills':
            case 'Languages':
                setters[`set${field}`]([
                    ...valuesField,
                    value,
                ]);
                break;
            default:
                setters[`set${field}`](value);
                break;
        };
    };

    const handleClick = (field, data = '') => {
        let elementValue;
        switch (field) {
            case 'Degree': {
                const projectData = {
                    [data.name]: {
                        dateStart: formatDate(data.dateStart),
                        dateEnd: formatDate(data.dateEnd),
                    },
                };

                elementValue = projectData;
                break;
            };
            case 'Experiences':
            case 'Projects': {
                const information = Object.entries(data)
                    .filter(([key, value]) => key.startsWith('bullet') && value !== '')
                    .map(([, value]) => value);
                const projectData = {
                    [data.name]: {
                        dateStart: formatDate(data.dateStart),
                        dateEnd: formatDate(data.dateEnd),
                        information: information,
                    },
                };

                elementValue = projectData;
                break;
            };
            default: {
                elementValue = document.getElementById(`sidebar-input-${field.toLowerCase()}`).value;
                break;
            };
        };

        handleChange(field, elementValue);
    };

    const formatDate = (date) => {
        const currentDate = new Date(date);
        return currentDate.toLocaleString('default', {
            month: 'long',
            year: 'numeric',
        });
    };

    const addNewBulletPoint = (field) => {
        const elementList = document.getElementById(`sidebar-${field.toLowerCase()}-list`);
        const newBulletPoint = document.createElement('li');
        newBulletPoint.innerHTML = `<input name='bullet${elementList.childElementCount}'/>`;
        elementList.appendChild(newBulletPoint);
    };

    return (
        <section className='sidebar'>
            <h1>Resume Builder</h1>
            <fieldset>
                <legend>Name</legend>
                <input onChange={(event) => handleChange('Name', event.target.value)}/>
            </fieldset>
            <fieldset>
                <legend>Location</legend>
                <input onChange={(event) => handleChange('Location', event.target.value)}/>
            </fieldset>
            <fieldset>
                <legend>Phone</legend>
                <input onChange={(event) => handleChange('Phone', event.target.value)}/>
            </fieldset>
            <fieldset>
                <legend>Email</legend>
                <input onChange={(event) => handleChange('Email', event.target.value)}/>
            </fieldset>
            <fieldset>
                <legend>Github</legend>
                <input onChange={(event) => handleChange('Github', event.target.value)}/>
            </fieldset>
            <fieldset>
                <legend>School</legend>
                <input onChange={(event) => handleChange('School', event.target.value)}/>
                |
                <input onChange={(event) => handleChange('SchoolLocation', event.target.value)}/>
            </fieldset>
            <fieldset className='sidebar-group'>
                <legend>Degree</legend>
                <form onSubmit={(event) => handleSubmit('Degree', event)}>
                    <div>
                        <input id='sidebar-input-degree'
                            name='name'/>
                        <button type='submit'>Add</button>
                    </div>
                    <div>
                        <input type='month'
                            name='dateStart'
                            required/>
                        |
                        <input type='month'
                            name='dateEnd'
                            required/>
                    </div>
                </form>
            </fieldset>
            <fieldset>
                <legend>Major</legend>
                <input onChange={(event) => handleChange('Major', event.target.value)}/>
            </fieldset>
            <fieldset>
                <legend>Achievements</legend>
                <input id='sidebar-input-achievements'/>
                <button onClick={() => handleClick('Achievements')}>Add</button>
            </fieldset>
            <fieldset>
                <legend>Courses</legend>
                <input id='sidebar-input-courses'/>
                <button onClick={() => handleClick('Courses')}>Add</button>
            </fieldset>
            <fieldset className='sidebar-group'>
                <legend>Experiences</legend>
                <form onSubmit={(event) => handleSubmit('Experiences', event)}>
                    <div>
                        <input id='sidebar-input-experiences'
                            name='name'/>
                        <button type='submit'>Add</button>
                    </div>
                    <div>
                        <input type='month'
                            name='dateStart'
                            required/>
                        |
                        <input type='month'
                            name='dateEnd'
                            required/>
                    </div>
                    <ul id='sidebar-experiences-list'>
                        <li>
                            <input name='bullet0'
                                required/>
                        </li>
                    </ul>
                    <button type='button'
                        onClick={() => addNewBulletPoint('Experiences')}>New Bullet Point</button>
                </form>
            </fieldset>
            <fieldset className='sidebar-group'>
                <legend>Projects</legend>
                <form onSubmit={(event) => handleSubmit('Projects', event)}>
                    <div>
                        <input id='sidebar-input-projects'
                            name='name'/>
                        <button type='submit'>Add</button>
                    </div>
                    <div>
                        <input type='month'
                            name='dateStart'
                            required/>
                        |
                        <input type='month'
                            name='dateEnd'
                            required/>
                    </div>
                    <ul id='sidebar-projects-list'>
                        <li>
                            <input name='bullet0'
                                required/>
                        </li>
                    </ul>
                    <button type='button'
                        onClick={() => addNewBulletPoint('Projects')}>New Bullet Point</button>
                </form>
            </fieldset>
            <fieldset>
                <legend>Technical Skills</legend>
                <input id='sidebar-input-technicalskills'/>
                <button onClick={() => handleClick('TechnicalSkills')}>Add</button>
            </fieldset>
            <fieldset>
                <legend>Languages</legend>
                <input id='sidebar-input-languages'/>
                <button onClick={() => handleClick('Languages')}>Add</button>
            </fieldset>
        </section>
    );
};

export default memo(Sidebar);