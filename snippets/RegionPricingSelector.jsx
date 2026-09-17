export const RegionPricingSelector = () => {
  const regions = [
    { code: "ams", city: "Amsterdam", country: "Netherlands", markup: 1.0 },
    { code: "iad", city: "Ashburn, Virginia (US)", country: "", markup: 1.0 },
    { code: "ord", city: "Chicago, Illinois (US)", country: "", markup: 1.21 },
    { code: "dfw", city: "Dallas, Texas (US)", country: "", markup: 1.21 },
    { code: "fra", city: "Frankfurt", country: "Germany", markup: 1.21 },
    { code: "jnb", city: "Johannesburg", country: "South Africa", markup: 3.0 },
    { code: "lhr", city: "London", country: "United Kingdom", markup: 1.21 },
    { code: "lax", city: "Los Angeles, California (US)", country: "", markup: 1.21 },
    { code: "bom", city: "Mumbai", country: "India", markup: 3.0 },
    { code: "cdg", city: "Paris", country: "France", markup: 1.21 },
    { code: "sjc", city: "San Jose, California (US)", country: "", markup: 1.21 },
    { code: "gru", city: "São Paulo", country: "Brazil", markup: 1.21 },
    { code: "ewr", city: "Secaucus, NJ (US)", country: "", markup: 1.21 },
    { code: "sin", city: "Singapore", country: "Singapore", markup: 2.0 },
    { code: "arn", city: "Stockholm", country: "Sweden", markup: 1.21 },
    { code: "syd", city: "Sydney", country: "Australia", markup: 2.0 },
    { code: "nrt", city: "Tokyo", country: "Japan", markup: 2.0 },
    { code: "yyz", city: "Toronto", country: "Canada", markup: 1.21 },
  ];
  const presets = [
    {
      name: "shared-cpu-1x",
      cpu: 1,
      cpuType: "shared",
      tiers: [
        { ram: "256MB", pricePerSecond: 0.00000078 },
        { ram: "512MB", pricePerSecond: 0.00000128 },
        { ram: "1GB", pricePerSecond: 0.00000228 },
        { ram: "2GB", pricePerSecond: 0.00000429 },
      ],
    },
    {
      name: "shared-cpu-2x",
      cpu: 2,
      cpuType: "shared",
      tiers: [
        { ram: "512MB", pricePerSecond: 0.00000156 },
        { ram: "1GB", pricePerSecond: 0.00000256 },
        { ram: "2GB", pricePerSecond: 0.00000456 },
        { ram: "4GB", pricePerSecond: 0.00000857 },
      ],
    },
    {
      name: "shared-cpu-4x",
      cpu: 4,
      cpuType: "shared",
      tiers: [
        { ram: "1GB", pricePerSecond: 0.00000312 },
        { ram: "2GB", pricePerSecond: 0.00000512 },
        { ram: "4GB", pricePerSecond: 0.00000913 },
        { ram: "8GB", pricePerSecond: 0.00001714 },
      ],
    },
    {
      name: "shared-cpu-6x",
      cpu: 6,
      cpuType: "shared",
      tiers: [
        { ram: "1.5GB", pricePerSecond: 0.00000467 },
        { ram: "3GB", pricePerSecond: 0.00000768 },
        { ram: "6GB", pricePerSecond: 0.00001369 },
        { ram: "12GB", pricePerSecond: 0.00002572 },
      ],
    },
    {
      name: "shared-cpu-8x",
      cpu: 8,
      cpuType: "shared",
      tiers: [
        { ram: "2GB", pricePerSecond: 0.00000623 },
        { ram: "4GB", pricePerSecond: 0.00001024 },
        { ram: "8GB", pricePerSecond: 0.00001826 },
        { ram: "16GB", pricePerSecond: 0.00003429 },
      ],
    },
    {
      name: "performance-1x",
      cpu: 1,
      cpuType: "performance",
      tiers: [
        { ram: "2GB", pricePerSecond: 0.00001242 },
        { ram: "4GB", pricePerSecond: 0.00001643 },
        { ram: "8GB", pricePerSecond: 0.00002445 },
      ],
    },
    {
      name: "performance-2x",
      cpu: 2,
      cpuType: "performance",
      tiers: [
        { ram: "4GB", pricePerSecond: 0.00002484 },
        { ram: "8GB", pricePerSecond: 0.00003286 },
        { ram: "16GB", pricePerSecond: 0.00004889 },
      ],
    },
    {
      name: "performance-4x",
      cpu: 4,
      cpuType: "performance",
      tiers: [
        { ram: "8GB", pricePerSecond: 0.00004968 },
        { ram: "16GB", pricePerSecond: 0.00006571 },
        { ram: "32GB", pricePerSecond: 0.00009778 },
      ],
    },
    {
      name: "performance-6x",
      cpu: 6,
      cpuType: "performance",
      tiers: [
        { ram: "12GB", pricePerSecond: 0.00007452 },
        { ram: "24GB", pricePerSecond: 0.00009857 },
        { ram: "48GB", pricePerSecond: 0.00014667 },
      ],
    },
    {
      name: "performance-8x",
      cpu: 8,
      cpuType: "performance",
      tiers: [
        { ram: "16GB", pricePerSecond: 0.00009936 },
        { ram: "32GB", pricePerSecond: 0.00013143 },
        { ram: "64GB", pricePerSecond: 0.00019556 },
      ],
    },
    {
      name: "performance-10x",
      cpu: 10,
      cpuType: "performance",
      tiers: [
        { ram: "20GB", pricePerSecond: 0.0001242 },
        { ram: "40GB", pricePerSecond: 0.00016428 },
        { ram: "80GB", pricePerSecond: 0.00024445 },
      ],
    },
    {
      name: "performance-12x",
      cpu: 12,
      cpuType: "performance",
      tiers: [
        { ram: "24GB", pricePerSecond: 0.00014904 },
        { ram: "48GB", pricePerSecond: 0.00019714 },
        { ram: "96GB", pricePerSecond: 0.00029334 },
      ],
    },
    {
      name: "performance-14x",
      cpu: 14,
      cpuType: "performance",
      tiers: [
        { ram: "28GB", pricePerSecond: 0.00017388 },
        { ram: "56GB", pricePerSecond: 0.00023 },
        { ram: "112GB", pricePerSecond: 0.00034224 },
      ],
    },
    {
      name: "performance-16x",
      cpu: 16,
      cpuType: "performance",
      tiers: [
        { ram: "32GB", pricePerSecond: 0.00019872 },
        { ram: "64GB", pricePerSecond: 0.00026286 },
        { ram: "128GB", pricePerSecond: 0.00039113 },
      ],
    },
  ];
  const [selected, setSelected] = useState(regions[0].code);
  const region = regions.find((r) => r.code === selected) ?? regions[0];

  const SECONDS_PER_HOUR = 3600;
  const SECONDS_PER_MONTH = 2592000; // 30 days
  const BASELINE_RAM_PRICE_PER_30_DAYS = 5;

  const monthFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  const formatPerSecond = (value) => `$${value.toFixed(8)}`;
  const formatPerHour = (value) => `$${value.toFixed(4)}`;
  const formatPerMonth = (value) => monthFormatter.format(value);
  return (
    <>
      <p>
        <label htmlFor="region-select">Region: </label>
        <select
          id="region-select"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="ml-2 rounded-md border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 px-3 py-1.5 shadow-sm focus:border-indigo-300 focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          {regions.map(({ code, city, country }) => (
            <option key={code} value={code}>
              {city}
              {country ? `, ${country}` : ""} ({code})
            </option>
          ))}
        </select>
      </p>

      <p>
        The price of a running <a href="/machines">Fly Machine</a> VM is the price of a named CPU/RAM preset, plus about{" "}
        {formatPerMonth(BASELINE_RAM_PRICE_PER_30_DAYS * region.markup)} per 30 days per GB of additional RAM.
      </p>

      <p>Here&rsquo;s the pricing for named presets and a few standard additional RAM configurations:</p>

      <table className="table-stripe">
        <thead>
          <tr>
            <th>Preset</th>
            <th>CPU(s)</th>
            <th>RAM</th>
            <th>Price/second</th>
            <th>Price/hour</th>
            <th>Price/month</th>
          </tr>
        </thead>
        <tbody>
          {presets.map((preset) =>
            preset.tiers.map((tier, tierIndex) => {
              const perSecond = tier.pricePerSecond * region.markup;
              return (
                <tr key={`${preset.name}-${tier.ram}`}>
                  {tierIndex === 0 && (
                    <>
                      <td rowSpan={preset.tiers.length}>{preset.name}</td>
                      <td rowSpan={preset.tiers.length}>
                        {preset.cpu} {preset.cpuType}
                      </td>
                    </>
                  )}
                  <td>{tier.ram}</td>
                  <td>{formatPerSecond(perSecond)}</td>
                  <td>{formatPerHour(perSecond * SECONDS_PER_HOUR)}</td>
                  <td>{formatPerMonth(perSecond * SECONDS_PER_MONTH)}</td>
                </tr>
              );
            }),
          )}
        </tbody>
      </table>
    </>
  );
};
