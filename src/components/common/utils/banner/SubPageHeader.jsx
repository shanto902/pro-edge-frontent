import { Link } from "react-router-dom";
import greaterThanIcon from '../../../../assets/icons/greaterThan.svg'

const PageHeader = ({ title = "", bgImage, breadcrumbs = [] }) => {
  return (
    <section className="relative w-full h-[20vh] md:h-[30vh] lg:h-[20vw] overflow-hidden">
      {/* Background image */}
      <img
        src={bgImage}
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Black overlay */}
      <div className="absolute inset-0 bg-black/60 bg-opacity-60"></div>

      {/* Content */}
      <div className="relative max-w-7xl w-full mx-auto h-full flex flex-col justify-center px-6 md:px-12 lg:px-20 text-white">
        <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
        <nav className="mt-2 text-sm md:text-base flex items-center gap-2 md:gap-4">
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center gap-2">
              {crumb.link ? (
                <Link to={crumb.link} className="hover:underline">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-gray-300">{crumb.label}</span>
              )}
              {index < breadcrumbs.length - 1 && (
                <img src={greaterThanIcon} alt=">" className="w-3 h-3" />
              )}
            </div>
          ))}
        </nav>
      </div>
    </section>
  );
};

export default PageHeader;

