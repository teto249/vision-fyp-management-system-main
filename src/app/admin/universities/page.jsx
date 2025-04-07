import Card from "./ui/Card";
export default function UniversityPage() {
  const products = [
    {
      title: "Apple Smart Watch",
      description:
        "Stay connected, motivated, and healthy with the latest Apple Watch.",
      image: "https://cdn.flyonui.com/fy-assets/components/card/image-9.png",
    },
    // Add more products as needed (minimum 4 for demo)
    {
      title: "Apple Smart Watch",
      description:
        "Stay connected, motivated, and healthy with the latest Apple Watch.",
      image: "https://cdn.flyonui.com/fy-assets/components/card/image-9.png",
    },
    {
      title: "Apple Smart Watch",
      description:
        "Stay connected, motivated, and healthy with the latest Apple Watch.",
      image: "https://cdn.flyonui.com/fy-assets/components/card/image-9.png",
    },
    {
      title: "Apple Smart Watch",
      description:
        "Stay connected, motivated, and healthy with the latest Apple Watch.",
      image: "https://cdn.flyonui.com/fy-assets/components/card/image-9.png",
    },
    {
      title: "Apple Smart Watch",
      description:
        "Stay connected, motivated, and healthy with the latest Apple Watch.",
      image: "https://cdn.flyonui.com/fy-assets/components/card/image-9.png",
    },
    // Add more products as needed (minimum 4 for demo)
    {
      title: "Apple Smart Watch",
      description:
        "Stay connected, motivated, and healthy with the latest Apple Watch.",
      image: "https://cdn.flyonui.com/fy-assets/components/card/image-9.png",
    },
    {
      title: "Apple Smart Watch",
      description:
        "Stay connected, motivated, and healthy with the latest Apple Watch.",
      image: "https://cdn.flyonui.com/fy-assets/components/card/image-9.png",
    },
    {
      title: "Apple Smart Watch",
      description:
        "Stay connected, motivated, and healthy with the latest Apple Watch.",
      image: "https://cdn.flyonui.com/fy-assets/components/card/image-9.png",
    },
    {
      title: "Apple Smart Watch",
      description:
        "Stay connected, motivated, and healthy with the latest Apple Watch.",
      image: "https://cdn.flyonui.com/fy-assets/components/card/image-9.png",
    },
    // Add more products as needed (minimum 4 for demo)
    {
      title: "Apple Smart Watch",
      description:
        "Stay connected, motivated, and healthy with the latest Apple Watch.",
      image: "https://cdn.flyonui.com/fy-assets/components/card/image-9.png",
    },
    {
      title: "Apple Smart Watch",
      description:
        "Stay connected, motivated, and healthy with the latest Apple Watch.",
      image: "https://cdn.flyonui.com/fy-assets/components/card/image-9.png",
    },
    {
      title: "Apple Smart Watch",
      description:
        "Stay connected, motivated, and healthy with the latest Apple Watch.",
      image: "https://cdn.flyonui.com/fy-assets/components/card/image-9.png",
    },
    {
      title: "Apple Smart Watch",
      description:
        "Stay connected, motivated, and healthy with the latest Apple Watch.",
      image: "https://cdn.flyonui.com/fy-assets/components/card/image-9.png",
    },
    // Add more products as needed (minimum 4 for demo)
    {
      title: "Apple Smart Watch",
      description:
        "Stay connected, motivated, and healthy with the latest Apple Watch.",
      image: "https://cdn.flyonui.com/fy-assets/components/card/image-9.png",
    },
    {
      title: "Apple Smart Watch",
      description:
        "Stay connected, motivated, and healthy with the latest Apple Watch.",
      image: "https://cdn.flyonui.com/fy-assets/components/card/image-9.png",
    },
    {
      title: "Apple Smart Watch",
      description:
        "Stay connected, motivated, and healthy with the latest Apple Watch.",
      image: "https://cdn.flyonui.com/fy-assets/components/card/image-9.png",
    },
  ];
  return (
    <div className="w-full  px-10 py-10">
      <div className="text-center mb-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-3">Universities</h1>{" "}
        <div className="w-24 h-1.5 bg-primary mx-auto"></div>{" "}
      </div>
      <p className="text-xl mb-10 text-center max-w-3xl mx-auto">
        {" "}
        Welcome to the Universities Page!
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product, index) => (
          <Card
            key={index}
            title={product.title}
            description={product.description}
            image={product.image}
          />
        ))}
      </div>
    </div>
  );
}
