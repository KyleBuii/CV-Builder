import { memo } from 'react';

const Sidebar = ({ setters }) => {
    const handleChange = (field, value) => {
        setters[field]?.(value);
    };

    const handleClick = (field, data = '') => {
        let elementValue;
        switch (field) {
            case 'school':
                // 'TOWSON UNIVERSITY': 'Towson, MD',
                break;
            case 'degree':
            case 'experiences':
            case 'projects': {
                const information = Object.entries(data)
                    .filter(([key]) => key.startsWith('bullet'))
                    .map(([, value]) => value);

                const projectData = {
                    [data[`${field.slice(0, -1)}Name`]]: {
                        dateStart: data.dateStart,
                        dateEnd: data.dateEnd,
                        information: information,
                    },
                };

                elementValue = projectData;
                break;
            };
            default: {
                elementValue = document.getElementById(`sidebar-input-${field}`).value;
                break;
            };
        };

        handleChange(field, elementValue);
    };

    const addNewBulletPoint = () => {
        const elementList = document.getElementById('sidebar-projects-list');
        const newBulletPoint = document.createElement('li');
        newBulletPoint.innerHTML = `<input name='bullet${elementList.childElementCount}'/>`;
        elementList.appendChild(newBulletPoint);
    };

    return (
        <section className='sidebar'>
            <h1>Resume Builder</h1>
            <fieldset>
                <legend>Name</legend>
                <input onChange={(event) => handleChange('name', event.target.value)}/>
            </fieldset>
            <fieldset>
                <legend>Location</legend>
                <input onChange={(event) => handleChange('location', event.target.value)}/>
            </fieldset>
            <fieldset>
                <legend>Phone</legend>
                <input onChange={(event) => handleChange('phone', event.target.value)}/>
            </fieldset>
            <fieldset>
                <legend>Email</legend>
                <input onChange={(event) => handleChange('email', event.target.value)}/>
            </fieldset>
            <fieldset>
                <legend>Github</legend>
                <input onChange={(event) => handleChange('github', event.target.value)}/>
            </fieldset>
            <fieldset>
                <legend>School</legend>
                <input onChange={(event) => handleChange('school', event.target.value)}/>
                |
                <input onChange={(event) => handleChange('schoolLocation', event.target.value)}/>
            </fieldset>
            <fieldset className='sidebar-group'>
                <legend>Degree</legend>
                <form onSubmit={(event) => {
                    event.preventDefault();

                    const formData = new FormData(event.target);
                    const values = Object.fromEntries(formData.entries());

                    handleClick('degree', values);
                }}>
                    <div>
                        <input id='sidebar-input-degree'
                            name='degreeName'/>
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
                <input onChange={(event) => handleChange('major', event.target.value)}/>
            </fieldset>
            <fieldset>
                <legend>Achievements</legend>
                <input id='sidebar-input-achievements'/>
                <button onClick={() => handleClick('achievements')}>Add</button>
            </fieldset>
            <fieldset>
                <legend>Courses</legend>
                <input id='sidebar-input-courses'/>
                <button onClick={() => handleClick('courses')}>Add</button>
            </fieldset>
            <fieldset className='sidebar-group'>
                <legend>Experiences</legend>
                <form onSubmit={(event) => {
                    event.preventDefault();

                    const formData = new FormData(event.target);
                    const values = Object.fromEntries(formData.entries());

                    handleClick('experiences', values);
                }}>
                    <div>
                        <input id='sidebar-input-experiences'
                            name='experienceName'/>
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
                        onClick={() => addNewBulletPoint()}>New Bullet Point</button>
                </form>
            </fieldset>
            <fieldset className='sidebar-group'>
                <legend>Projects</legend>
                <form onSubmit={(event) => {
                    event.preventDefault();

                    const formData = new FormData(event.target);
                    const values = Object.fromEntries(formData.entries());

                    handleClick('projects', values);
                }}>
                    <div>
                        <input id='sidebar-input-projects'
                            name='projectName'/>
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
                        onClick={() => addNewBulletPoint()}>New Bullet Point</button>
                </form>
            </fieldset>
            <fieldset>
                <legend>Technical Skills</legend>
                <input id='sidebar-input-technicalSkills'/>
                <button onClick={() => handleClick('technicalSkills')}>Add</button>
            </fieldset>
            <fieldset>
                <legend>Languages</legend>
                <input id='sidebar-input-languages'/>
                <button onClick={() => handleClick('languages')}>Add</button>
            </fieldset>
        </section>
    );
};

export default memo(Sidebar);