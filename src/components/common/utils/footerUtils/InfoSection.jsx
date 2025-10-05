const InfoSection = ({ heading, items }) => (
  <div className="flex flex-col space-y-4 text-white">
    <h2 className="text-xl md:text-2xl font-medium">{heading}</h2>
    <div className="space-y-2">
      {items.map((info) => (
        <div key={info.title}>
          <h3 className="font-semibold">{info.title}</h3>
          <p>{info.text}</p>
        </div>
      ))}
    </div>
  </div>
);

export default InfoSection