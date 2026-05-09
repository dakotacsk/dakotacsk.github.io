import gundamImage from "../../img/gundam_screenshot.png";
import nfiImage from "../../img/NFI.png";
import moonImage from "../../img/moon.jpg";

export const projects = [
  {
    id: "nuggy",
    title: "Nuggy",
    badge: "Active",
    badgeType: "active",
    description: "Dynamic pricing for cannabis retail.",
    image: "img/grid-wave4-gif.gif",
    href: "https://nuggy.io",
  },
  {
    id: "gunpla",
    title: "GunPla Materials",
    badge: "Design",
    badgeType: "deployed",
    description: "Material science through GunPla design.",
    image: gundamImage,
    href: "https://dakotacsk.com/gundam-mcci2026/",
    fitContain: true,
    large: true,
  },
  {
    id: "nfi",
    title: "NFI AI Prototype",
    badge: "Consulting",
    badgeType: "active",
    description: "AI-guided industrial print consulting.",
    image: nfiImage,
    href: "https://chatgpt.com/g/g-69eeb0cbc7d08191ba5cf685581bcfef-nfi-opportunity-prototype-agent",
    fitContain: true,
  },
  {
    id: "local-democracy",
    title: "Local Democracy",
    badge: "Civic",
    badgeType: "deployed",
    description: "Volunteer and town hall mobilization.",
    image: moonImage,
    href: "https://drive.google.com/drive/folders/1KAxVuUjpmO5YCsQAaMORDNxCx7B1qonk?usp=sharing",
    shader: "water",
  },
  {
    id: "pest-detection",
    title: "Pest Detection",
    badge: "Internship",
    badgeType: "deployed",
    description: "ML + DevOps.",
    image: "img/bug_yolo.gif",
    href: "https://www.owl-vision.ai/",
  },
  {
    id: "hvac",
    title: "HVAC Optimization",
    badge: "Research",
    badgeType: "deployed",
    description: "RL + VAE + GBR + LSTM.",
    image: "img/hvac_poster.svg",
  },
  {
    id: "press-shield",
    title: "Press Shield",
    badge: "Project",
    badgeType: "deployed",
    description: "Tools for local journalists.",
    image: "img/press_shield.png",
    fitContain: true,
  },
  {
    id: "justice-chamber",
    title: "Justice Chamber",
    badge: "Project",
    badgeType: "deployed",
    description: "Interactive justice exploration.",
    image: "img/justice-chamber.gif",
    href: "https://sites.google.com/view/justicechamber/home",
  },
];

export const experiences = [
  { company: "Nuggy", role: "Co-Founder", color: "#f5a623" },
  { company: "Netflix", role: "SWE Fellowship", color: "#e50914" },
  { company: "Indico Data", role: "ML R&D Intern", color: "#4a90d9" },
  { company: "Barn Owls", role: "ML Intern", color: "#8b6e4e" },
  { company: "Olin RL Lab", role: "ML Researcher", color: "#607744" },
];

export const socialLinks = [
  {
    href: "mailto:schang2@olin.edu",
    title: "Email",
    iconClass: "fas fa-envelope",
  },
  {
    href: "https://linkedin.com/in/dakota-chang-0000abcd/",
    title: "LinkedIn",
    iconClass: "fab fa-linkedin",
  },
  {
    href: "https://github.com/dakotacsk",
    title: "GitHub",
    iconClass: "fab fa-github",
  },
  {
    href: "https://instagram.com/dakotachang_sk/",
    title: "Instagram",
    iconClass: "fab fa-instagram",
  },
];
