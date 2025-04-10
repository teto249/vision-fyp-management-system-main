import Card from "./ui/Card";
// app/universities/page.tsx
export default function UniversityPage() {
  const universities = [
    {
      title: "Stanford University",
      description:
        "Top-tier institution known for innovation, offering diverse undergraduate and graduate programs.",
      image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f",
      location: "Stanford, CA",
      students: 16000,
      capacity: 93,
    },
    {
      title: "Harvard University",
      description:
        "Prestigious Ivy League university with a focus on academic excellence and leadership.",
      image: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b",
      location: "Cambridge, MA",
      students: 20000,
      capacity: 90,
    },
    {
      title: "MIT",
      description:
        "Globally renowned for STEM programs, innovation, and impactful research.",
      image: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc",
      location: "Cambridge, MA",
      students: 12000,
      capacity: 88,
    },
    {
      title: "UC Berkeley",
      description:
        "Leading public university fostering groundbreaking research and dynamic campus life.",
      image: "https://images.unsplash.com/photo-1587613751709-8b1eb8d3fc6c",
      location: "Berkeley, CA",
      students: 45000,
      capacity: 87,
    },
    {
      title: "University of Oxford",
      description:
        "A historic institution excelling in academics and intellectual achievements.",
      image: "https://images.unsplash.com/photo-1562842088-9570f6c29d81",
      location: "Oxford, UK",
      students: 26000,
      capacity: 91,
    },
    {
      title: "University of Toronto",
      description:
        "Respected Canadian university, known for its international outlook and research impact.",
      image: "https://images.unsplash.com/photo-1580327331265-6ac5900ab784",
      location: "Toronto, Canada",
      students: 95000,
      capacity: 88,
    },
    {
      title: "Yale University",
      description:
        "Ivy League university combining rich history and academic excellence.",
      image: "https://images.unsplash.com/photo-1561484934-9982b372f830",
      location: "New Haven, CT",
      students: 15000,
      capacity: 85,
    },
    {
      title: "University of Tokyo",
      description:
        "Premier Japanese institution offering world-class education and diverse research opportunities.",
      image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b",
      location: "Tokyo, Japan",
      students: 30000,
      capacity: 89,
    },
  ];

  return (
    <div className="w-full px-4 sm:px-6  py-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-300 mb-3">
            Universities
          </h1>
          <div className="w-24 h-1.5 bg-teal-600 mx-auto rounded-full" />
          <p className="mt-6 text-lg text-gray-200 max-w-2xl mx-auto">
            Explore partner universities and their current system utilization
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {universities.map((uni, index) => (
            <Card
              key={index}
              title={uni.title}
              description={uni.description}
              image={uni.image}
              location={uni.location}
              students={uni.students}
              capacity={uni.capacity}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
