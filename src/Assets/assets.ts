import logo from './logo.png';
import whyMe1 from "./whyMe1.svg"
import whyMe2 from "./whyMe2.svg"
import whyMe3 from './whyM3.svg'
import offer1 from './Offer-1.svg';
import offer2 from './Offer-2.svg';
import offer3 from './Offer-3.svg';
import offer4 from './offer4.svg';
import offer5 from './offer5.svg';
import arrow from "./arrow.svg";
import hero from './hero.webp';
import mobile from './mobile-mockup.svg';
import minusIcon from './Minus-Icon.svg';
import plusIcon from './Plus-Icon.svg';


export const assets = {
    logo,
    arrow,
    hero,
    mobile,
    minusIcon,
    plusIcon
};

// Links
type Link = {
    name: string;
    path: string;
};

export const links: Link[] = [
    {
        name: "Home",
        path: "/",
    },
    {
        name: "About",
        path: "/about",
    },
    {
        name: "Projects",
        path: "/projects",
    },
    {
        name: "Services",
        path: "/services",
    },
    {
        name: "Contact",
        path: "/contact",
    },
];


// Why Choose me
type WhyMe = {
    image: string;
    title: string;
    description: string;
}

export const whyChooseMe: WhyMe[] = [
    {
        image: whyMe1,
        title: "Tailored Web Solutions",
        description:
            "Every project I build is tailored to your business goals, using the MERN stack to create efficient full-stack apps that solve real problems.",
    },
    {
        image: whyMe2,
        title: "User-First Experience",
        description:
            "I design applications with the end-user in mind — ensuring intuitive UI, fast performance, and a smooth journey from landing to action.",
    },
    {
        image: whyMe3,
        title: "Cutting-Edge Technologies",
        description:
            "With tools like React.js, Next.js, and Node.js, I stay ahead of trends to build modern, scalable, and secure web apps.",
    },
];


// Projects
type Project = {
    image: string;
    title: string;
    description: string;
    liveLink: string;
    githubLink: string;
    category: "Frontend" | "Backend" | "Full Stack";
};

export const projects: Project[] = [
    {
        image: "/images/amingarage.png",
        title: "Amin Garage",
        description:
            "A complete Garage website built using React.js, TypeScript, Tailwind CSS, and EmailJS for contact form functionality.",
        liveLink: "https://amingarage.com/",
        githubLink: "https://github.com/razaaliwebdev/amingarage",
        category: "Frontend",
    }
];

// My Process   / My Work Flow
export type MyProcess = {
    step: number;
    title: string;
    description: string;
};

export const myProcess: MyProcess[] = [
    {
        step: 1,
        title: "Discovery",
        description:
            "I start by understanding your brand, goals, and audience. Through a consultation call and discovery session, I collect the insights needed to build a solution that truly fits your needs.",
    },
    {
        step: 2,
        title: "Design",
        description:
            "With the strategy in place, I begin crafting wireframes and UI designs that reflect your vision. Using modern design tools and components, I ensure the look is clean, user-focused, and aligned with your brand.",
    },
    {
        step: 3,
        title: "Development",
        description:
            "I develop the full-stack solution using the MERN stack — React, Tailwind, Node.js, Express, and MongoDB. This includes both frontend interactions and backend functionality, ensuring everything works seamlessly.",
    },
    {
        step: 4,
        title: "Launch & Support",
        description:
            "Once the site is ready, I thoroughly test it and deploy it using platforms like Vercel or Render. After launch, I remain available to support, update, or scale your website as your needs evolve.",
    },
];


// What I Offer  / Services
export type ServiceData = {
    image: string,
    title: string;
    subtitle: string;
    description: string;
    features: string[];
    cta: string;
};

export const whatIOffer: ServiceData[] = [
    {
        image: offer1,
        title: "Web Design",
        subtitle: "Empowering Brands Through Design",
        description:
            "Creating visually stunning and user-friendly websites is at the heart of what I do. I focus on clean UI/UX with modern layouts tailored to your brand.",
        features: [
            "Custom Tailored Design",
            "Responsive Layouts",
            "UI/UX Best Practices",
        ],
        cta: "Schedule a consultation",
    },
    {
        image: offer2,
        title: "Development",
        subtitle: "Bringing Your Designs to Life",
        description:
            "I develop fully functional web apps using the MERN stack with clean, efficient, and scalable code that performs well across all devices and browsers.",
        features: [
            "REACT, NODE, NEXT, & JS Expertise",
            "Cross-Browser Compatibility",
            "Faster Load Times",
        ],
        cta: "Schedule a consultation",
    },
    {
        image: offer3,
        title: "Brand Identity",
        subtitle: "Helping You Stand Out",
        description:
            "I help craft cohesive brand identities that resonate — from logo design to color schemes, ensuring consistency across every digital touchpoint.",
        features: [
            "Logo Design",
            "Cohesive Color Palettes",
            "Brand Guidelines",
        ],
        cta: "Schedule a consultation",
    },
];


export type About = {
    heading: string;
    subtitle: string;
    description: string;
};

export const about: About = {
    heading: "About Me",
    subtitle: "Discover My Development Journey",
    description:
        "Hello! I’m Raza Ali, a self-taught Full Stack Web Developer specializing in the MERN stack. With a passion for clean code and modern UI/UX, I build dynamic, scalable, and user-focused web applications. My mission is to turn ideas into full-featured digital products that are fast, secure, and responsive — tailored to your specific business goals.",
};

export type SocialLinkes = {
    name: string;
    link: string;
    icon: "github" | "linkedin" | "twitter" | "facebook";
};

export const socialLinks: SocialLinkes[] = [
    {
        name: "GitHub",
        link: "https://github.com/razaaliwebdev/",
        icon: "github",
    },
    {
        name: "LinkedIn",
        link: "https://www.linkedin.com/in/raza-webdev/",
        icon: "linkedin",
    },
    {
        name: "Twitter",
        link: "https://x.com/razaaliwebdev  ",
        icon: 'twitter',
    },
    {
        name: "Facebook",
        link: "https://web.facebook.com/?_rdc=1&_rdr",
        icon: 'facebook',
    },
];


// By The Number  / Stat
export type Stat = {
    value: string;
    label: string;
    description: string;
};

export const byTheNumber: Stat[] = [
    {
        value: "05+",
        label: "Years of Experience",
        description: "Delivering production-grade web applications that scale.",
    },
    {
        value: "50+",
        label: "Projects Delivered",
        description: "From landing pages to full-stack platforms, delivered with quality and speed.",
    },
    {
        value: "98%",
        label: "Client Satisfaction",
        description: "I build long-term partnerships through performance and trust.",
    },
];



// My Success Stories || Testimonials
export type Testimonial = {
    image: string,
    quote: string;
    name: string;
    position: string;
    company: string;
};


export const testimonials: Testimonial[] = [
    {
        quote:
            "Working with Raza was a game-changer for our platform. His full-stack expertise brought our vision to life with outstanding performance and clean design.",
        name: "Adnan Amin",
        position: "Co.Founder",
        company: "WB DigiTech",
        image: "https://images.unsplash.com/photo-1592046285097-6cdf4daf0d69?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Ym95c3xlbnwwfHwwfHx8MA%3D%3D"
    },
    {
        quote:
            "Raza delivered a fast and reliable web app that reflects our brand perfectly. He welcomed feedback throughout the process. Highly recommend working with him!",
        name: "Wade Warren",
        position: "Founder",
        company: "Creaty",
        image: "https://images.unsplash.com/photo-1611637576109-b6f76185ec9b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGJveXN8ZW58MHx8MHx8fDA%3D"
    },
];




// ****************** ABOUT PAGE DATA **********************
export type AboutData = {
    title: string;
    description: string;
};

export const aboutData: AboutData = {
    title: "Welcome to My Development World",
    description: "My journey into web development began with curiosity and determination. With no formal degree in computer science, I immersed myself in the MERN stack — learning how to blend logic with creativity to craft modern, scalable web applications.Over time, I’ve built a portfolio of responsive, user-first projects that range from authentication systems and API-integrated dashboards to full-stack applications for real businesses. My goal isn’t just to write code — it’s to create digital experiences that solve real problems and deliver value.What drives me is constant learning, clean code, and a desire to bring ideas to life — from vision to launch."
};

export type ExperienceType = {
    role: string;
    company: string;
    duration: string;
    description: string[];
};

export const experience: ExperienceType[] = [
    {
        role: "Front-End Web Developer Intern",
        company: "Leon Advert, Lahore",
        duration: "June 2022 – November 2022",
        description: [
            "Built responsive web interfaces using HTML, CSS, and JavaScript.",
            "Worked closely with senior developers to implement UI components.",
            "Improved accessibility and performance of web pages.",
            "Collaborated with designers and marketing teams to fulfill client requirements.",
        ],
    },
    {
        role: "Freelance Front-End Developer",
        company: "Amin Garage",
        duration: "January 2025 – Present",
        description: [
            "Designed and developed a fully responsive auto service website using React.js, TypeScript, and Tailwind CSS.",
            "Integrated EmailJS for client-side form submissions and email notifications.",
            "Built reusable components and ensured mobile-first design principles.",
            "Delivered a modern UI with smooth animations and clean user experience.",
        ],
    },
];





// ****************** PROJECTS PAGE DATA **********************
export type FAQ = {
    question: string;
    answer: string;
};

export const faqs: FAQ[] = [
    {
        question: "What services do you offer?",
        answer:
            "I offer a range of services including web design, front-end development, UX/UI design, responsive design, e-commerce solutions, and brand identity creation. Visit my Services page for a detailed overview.",
    },
    {
        question: "How do you approach a new project?",
        answer:
            "My process begins with a discovery call to understand your goals and audience. I then move into design, development, and deployment — ensuring a seamless journey from idea to live product.",
    },
    {
        question: "What is your project timeline?",
        answer:
            "Project timelines vary based on complexity and scope. A typical website project can take 2–6 weeks. I’ll provide a detailed timeline after the initial consultation.",
    },
    {
        question: "How much do your services cost?",
        answer:
            "Pricing depends on the project's requirements and deliverables. After our initial consultation, I’ll share a custom quote tailored to your goals and budget.",
    },
    {
        question: "What platforms do you work with?",
        answer:
            "I specialize in the MERN stack (MongoDB, Express, React, Node.js) and Next.js for web apps. I also work with platforms like Vercel, Render, EmailJS, and CMSs like WordPress when needed.",
    },
];





// ****************** SERVICES PAGE DATA **********************
type Service = {
    image: string;
    title: string;
    subtitle: string;
    description: string;
    features: string[];
    startingPrice: string; // must be a string
};


export const services: Service[] = [
    {
        image: offer1,
        title: "Full Stack Development",
        subtitle: "MERN & Next.js Applications",
        description:
            "I develop full-stack web applications using the MERN stack and Next.js. My focus is on performance, scalability, and clean API integration with modern frontend architectures.",
        features: [
            "React.js & Next.js (App Router)",
            "Node.js + Express.js Backend",
            "MongoDB & Mongoose Database Integration",
            "RESTful API Design & Authentication (JWT, OAuth)",
        ],
        startingPrice: "$750",
    },
    {
        image: offer2,
        title: "Frontend Development",
        subtitle: "Modern, Responsive & Interactive UI",
        description:
            "I craft pixel-perfect, accessible, and mobile-responsive interfaces using modern frontend tools. My work emphasizes clean code, reusability, and optimized performance.",
        features: [
            "HTML5, CSS3, JavaScript (ES6+)",
            "React.js with TypeScript",
            "Tailwind CSS for utility-first design",
            "Form Handling & EmailJS Integration",
        ],
        startingPrice: "$500",
    },
    {
        image: offer3,
        title: "Backend & API Development",
        subtitle: "Secure, Scalable Server-Side Logic",
        description:
            "I build REST APIs with Node.js and Express.js, handling user auth, data flow, and scalable logic. Integrated with MongoDB for flexible and efficient data storage.",
        features: [
            "Node.js + Express.js Framework",
            "MongoDB/Mongoose ODM",
            "JWT Authentication & Middleware",
            "API Routing & Validation",
        ],
        startingPrice: "$550",
    },
    {
        image: offer4,
        title: "Software Engineering & Deployment",
        subtitle: "CI/CD, Hosting & Version Control",
        description:
            "I manage your app lifecycle from Git-based version control to production deployment with tools like Vercel and Render, including .env management and performance checks.",
        features: [
            "Git & GitHub Workflow",
            "Deployment on Vercel / Render",
            "Environment Variables & Production Build",
            "Project Structure & Optimization",
        ],
        startingPrice: "$500",
    },
    {
        image: offer5,
        title: "Branding & Visual Identity",
        subtitle: "Minimal Visual Design & Brand Presence",
        description:
            "I assist in creating a consistent visual identity for your digital brand — focusing on simplicity, legibility, and relevance to your target audience.",
        features: [
            "Custom Color Palette & Fonts",
            "Clean UI Styling Consistency",
            "Minimal Logo/Visual Direction",
        ],
        startingPrice: "$300",
    },
];

export type Expect = {
    title: string;
    description: string
}

export const expectations: Expect[] = [
    {
        title: "Personalized Solutions",
        description:
            "I don’t believe in cookie-cutter code. Whether it’s a startup site or a full-stack web app, I tailor every solution to your specific needs using the right tech stack.",
    },
    {
        title: "Clear & Consistent Communication",
        description:
            "You'll always know where your project stands. I provide regular updates, transparent timelines, and open collaboration throughout the development process.",
    },
    {
        title: "Post-Launch Support",
        description:
            "I stand by my work. After deployment, I offer continued support, minor fixes, and guidance to ensure your app stays secure and up-to-date.",
    },
];




// ****************** CONTACT PAGE DATA **********************


