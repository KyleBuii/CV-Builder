import { memo } from 'react';
import './Page.scss';

const Page = ({ name, location, phone, email, github, school, schoolLocation, degree, major, achievements, courses, experiences, projects, technicalSkills, languages }) => {
    return (
        <section className='resume'>
            <h2 className='screen-reader-only'>Resume</h2>
            <section className='header'>
                <h3>{name}</h3>
                <span>{location} {(phone !== '') && `| P: ${phone}`} {(email !== '') && `| ${email}`} {(github !== '') && `| GitHub: ${github}`}</span>
            </section>
            <section className='group'>
                <h4>EDUCATION</h4>
                <div className='end-to-end'>
                    <span>
                        <b>{school}</b>
                    </span>
                    <span>{schoolLocation}</span>
                </div>
                <div className='end-to-end'>
                    <span>{Object.keys(degree)}</span>
                    <span>{degree[Object.keys(degree)].dateStart} - {degree[Object.keys(degree)].dateEnd}</span>
                </div>
                <span>Major in {major}</span>
                <span>
                    {achievements.map((achievement) => {
                        return `${achievement}; `
                    })}
                </span>
                <span>
                    Relevant Coursework:
                    {courses.map(((course) => ` ${course};`))}
                </span>
            </section>
            <section className='group'>
                <h4>EXPERIENCE</h4>
                {Object.keys(experiences).map((experience) => {
                    const experienceInformation = experiences[experience];
                    return <section key={experience}>
                        <div className='end-to-end'>
                            <h5>{experience}</h5>
                            <span>{experienceInformation.dateStart} - {experienceInformation.dateEnd}</span>
                        </div>
                        <ul>
                            {experienceInformation.information.map((info, index) => {
                                return <li key={`${experience}-info-${index}`}>
                                    {info}
                                </li>
                            })}
                        </ul>
                    </section>
                })}
            </section>
            <section className='group'>
                <h4>PROJECTS</h4>
                {Object.keys(projects).map((project) => {
                    const projectInformation = projects[project];
                    return <section key={project}>
                        <div className='end-to-end'>
                            <h5>{project}</h5>
                            <span>{projectInformation.dateStart} - {projectInformation.dateEnd}</span>
                        </div>
                        <ul>
                            {projectInformation.information.map((info, index) => {
                                return <li key={`${project}-info-${index}`}>
                                    {info}
                                </li>
                            })}
                        </ul>
                    </section>
                })}
            </section>
            <section className='group'>
                <h4>ADDITIONAL</h4>
                <div>
                    <b>Technical Skills:</b>
                    {technicalSkills.map((skill, index) => {
                        return <span key={`skill-${index}`}> {skill};</span>
                    })}
                </div>
                <div>
                    <b>Languages:</b>
                    {languages.map((language, index) => {
                        return <span key={`language-${index}`}> {language};</span>
                    })}
                </div>
            </section>
        </section>
    );
};
export default memo(Page);