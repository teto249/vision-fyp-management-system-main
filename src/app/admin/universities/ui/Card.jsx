export default function Card() {
  return (
    <div className="card w-full"> {/* Removed max-w-sm and made full width */}
      <figure className="h-60"> {/* Fixed image height */}
        <img
          src="https://cdn.flyonui.com/fy-assets/components/card/image-9.png"
          alt="Watch"
          className="w-full h-full object-cover" /* Ensure image fills container */
        />
      </figure>
      <div className="card-body p-6"> {/* Increased padding */}
        <h5 className="card-title text-xl mb-3">Apple Smart Watch</h5> {/* Larger text */}
        <p className="mb-5 text-base">
          Stay connected, motivated, and healthy with the latest Apple Watch.
        </p>
        <div className="card-actions">
          <button className="btn btn-primary btn-md">Buy Now</button> {/* Larger buttons */}
          <button className="btn btn-secondary btn-soft btn-md">Add to cart</button>
        </div>
      </div>
    </div>
  );
}
