import { memo, useState } from "react";
import Page from "./Page";
import Sidebar from "./Sidebar";

const App = () => {
    const [name, setName] = useState('KYLE BUI');
    const [location, setLocation] = useState('Silver Spring, MD');
    const [phone, setPhone] = useState('+1 2408832126');
    const [email, setEmail] = useState('buikyle12@gmail.com');
    const [github, setGithub] = useState('KyleBuii');
    const [school, setSchool] = useState('TOWSON UNIVERSITY');
    const [schoolLocation, setSchoolLocation] = useState('Towson, MD');
    const [degree, setDegree] = useState({
        'Bachelor of Computer Science': {
            dateStart: 'Aug 2019',
            dateEnd: 'Dec 2023',
        },
    });
    const [major, setMajor] = useState('Computer Science');
    const [achievements, setAchievements] = useState([
        "Dean's List 2023",
        "Dean's List 2024", 
    ]);
    const [courses, setCourses] = useState([
        'Data Structure',
        'Software Engineering',
    ]);
    const [experiences, setExperiences] = useState({
        'WEB DEVELOPER': {
            dateStart: 'June 2025',
            dateEnd: 'Present',
            information: [
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
                'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
            ],
        },
    });
    const [projects, setProjects] = useState({
        'CV APPLICATION': {
            dateStart: 'June 2025',
            dateEnd: 'Present',
            information: [
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
                'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
            ],
        },
    });
    const [technicalSkills, setTechnicalSkills] = useState([
        'Advanced in React',
        'Proficient in JavaScript, HTML/CSS',
    ]);
    const [languages, setLanguages] = useState([
        'Fluent in English',
        'Conversational Proficiency in Vietnamese',
    ]);

    const createSetterArray = (setter, currentValue) => (newItem) => {
        setter([...currentValue, newItem]);
    };
    const createSetterObject = (setter, currentValue) => (newItem) => {
        setter({ ...currentValue, ...newItem });
    };

    const handleSetAchievements = createSetterArray(setAchievements, achievements);
    const handleSetCourses = createSetterArray(setCourses, courses);
    const handleSetExperiences = createSetterObject(setExperiences, experiences);
    const handleSetProjects = createSetterObject(setProjects, projects);
    const handleSetTechnicalSkills = createSetterArray(setTechnicalSkills, technicalSkills);
    const handleSetLanguages = createSetterArray(setLanguages, languages);

    const setters = {
        name: setName,
        location: setLocation,
        phone: setPhone,
        email: setEmail,
        github: setGithub,
        school: setSchool,
        schoolLocation: setSchoolLocation,
        degree: setDegree,
        major: setMajor,
        achievements: handleSetAchievements,
        courses: handleSetCourses,
        experiences: handleSetExperiences,
        projects: handleSetProjects,
        technicalSkills: handleSetTechnicalSkills,
        languages: handleSetLanguages,
    };

    return (
        <div>
            <Sidebar setters={setters}/>
            <Page
                name={name}
                location={location}
                phone={phone}
                email={email}
                github={github}
                school={school}
                schoolLocation={schoolLocation}
                degree={degree}
                major={major}
                achievements={achievements}
                courses={courses}
                experiences={experiences}
                projects={projects}
                technicalSkills={technicalSkills}
                languages={languages}/>
        </div>
    );
};

export default memo(App);