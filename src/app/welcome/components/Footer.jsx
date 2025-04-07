import Image from "next/image";
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-[#F6F6F6] py-12">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Image
              src="/logo.png"
              alt="Logo"
              width={50}
              height={50}
              className="rounded-full"
            />
            <span className="font-bold">
              VISION <br /> <i> FYP Management System </i>{" "}
            </span>
          </div>
          <p className="text-sm">Secure • Reliable • Accredited</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Product</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-blue-400">
                Features
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-400">
                Security
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-400">
                Pricing
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-blue-400">
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-400">
                Blog
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-400">
                Contact
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-blue-400">
                Privacy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-400">
                Terms
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-400">
                GDPR
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-gray-800 text-center">
        <p className="text-sm">
          © 2024 VISION FYP Management System. Developed for UTM Faculty of
          Computing
        </p>
        <p className="text-sm">
          © This System has been Developed by Altayeb Mustafa Ibrahim
          Abdelrasoul
        </p>
      </div>
    </footer>
  );
}
