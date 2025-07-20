// Simple configuration file for easy content management
// All your personal information and content in one place

const portfolioConfig = {
  // Personal Information
  personal: {
    name: "Saw Ye Htet",
    title: "Software Engineer • IT Student • Tech Enthusiast",
    location: "📍 Singapore",
    email: "minwn2244@gmail.com",
    profileImage: "assets/profile-picture.jpg",
  },

  // Social Links
  socialLinks: [
    { name: "X (Twitter)", url: "https://x.com/saulyehtet_" },
    { name: "GitHub", url: "https://github.com/sawyairhtet" },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/saw-ye-htet-the-man-who-code/",
    },
    { name: "Gallery", url: "pages/gallery.html" },
  ],

  // Introduction Text
  introduction: `I'm a passionate software engineer and IT student at Singapore Polytechnic, dedicated to building innovative digital solutions. I love exploring the intersection of technology and real-world applications, seeking opportunities to connect the dots of technological innovations. Currently pursuing my Diploma in Information Technology while gaining practical experience in the hospitality industry.`,

  // Projects/Learning Section
  projects: [
    {
      title: "Personal Portfolio Website",
      description:
        "This website! Built with vanilla HTML, CSS, and JavaScript to showcase my journey as an IT student. Features responsive design, clean aesthetics, and interactive elements while maintaining fast performance.",
    },
    {
      title: "Database Management Projects",
      description:
        "Academic projects focusing on database design, implementation, and optimization. Learning SQL, database normalization, and working with relational database management systems.",
    },
    {
      title: "Responsive Web Design Studies",
      description:
        "Developing skills in creating modern, responsive websites that work across all devices. Focus on user experience, accessibility, and performance optimization in web development.",
    },
  ],

  // Timeline
  timeline: [
    {
      year: "2025",
      title: "IT Student & Part-time Food Runner",
      description:
        "Pursuing Diploma in Information Technology at Singapore Polytechnic while working part-time at Capella Hotel, learning communication and interaction skills in a professional environment.",
    },
    {
      year: "2023",
      title: "Started Information Technology Diploma",
      description:
        "Began my journey of Diploma in Information Technology at Singapore Polytechnic, focusing on software development, and problem-solving skills.",
    },
    {
      year: "2020",
      title: "High School Graduate",
      description:
        "Completed High School Education at Family Private High School, developing foundational knowledge and passion for technology.",
    },
  ],

  // Things You Love
  thingsILove: [
    {
      title: "Clean Code",
      description: "Writing code that's easy to read and maintain",
    },
    {
      title: "Problem Solving",
      description: "Breaking down complex challenges into manageable pieces",
    },
    {
      title: "Database Design",
      description: "Creating efficient and scalable data structures",
    },
    {
      title: "Responsive Design",
      description: "Building websites that work beautifully on any device",
    },
    {
      title: "Learning New Technologies",
      description: "Staying curious about emerging tools and frameworks",
    },
    {
      title: "Open Source Community",
      description: "The collaborative spirit of developers worldwide",
    },
    {
      title: "VS Code",
      description: "My favorite code editor for development",
    },
    {
      title: "Team Collaboration",
      description: "Working together to build something amazing",
    },
    {
      title: "User Experience",
      description: "Creating intuitive and accessible digital experiences",
    },
    {
      title: "Continuous Learning",
      description: "Embracing the journey of lifelong education in tech",
    },
  ],

  // Blog Posts (simplified)
  blogPosts: [
    {
      title: "React Performance Optimization: A Deep Dive",
      date: "January 10, 2025",
      readTime: "8 min read",
      category: "Development",
      url: "blog/react-performance-optimization.html",
      excerpt:
        "Learn essential techniques for optimizing React applications for better performance and user experience.",
    },
    {
      title: "Urban Photography Techniques",
      date: "December 28, 2024",
      readTime: "6 min read",
      category: "Photography",
      url: "blog/urban-photography-techniques.html",
      excerpt:
        "Exploring creative techniques for capturing the essence of urban environments.",
    },
  ],
};

// Export for use in other files
if (typeof module !== "undefined" && module.exports) {
  module.exports = portfolioConfig;
}
