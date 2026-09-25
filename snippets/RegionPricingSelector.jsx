export const RegionPricingSelector = () => {
  // Price relative to Ashburn (iad), as billed. Same values as landing's data/pricing.yml.
  const regions = [
    { code: "ams", city: "Amsterdam", country: "Netherlands", markup: 1.038461538 },
    { code: "iad", city: "Ashburn, Virginia (US)", country: "", markup: 1 },
    { code: "ord", city: "Chicago, Illinois (US)", country: "", markup: 1.25 },
    { code: "dfw", city: "Dallas, Texas (US)", country: "", markup: 1.25 },
    { code: "fra", city: "Frankfurt", country: "Germany", markup: 1.153846154 },
    { code: "jnb", city: "Johannesburg", country: "South Africa", markup: 1.302884615 },
    { code: "lhr", city: "London", country: "United Kingdom", markup: 1.134615385 },
    { code: "lax", city: "Los Angeles, California (US)", country: "", markup: 1.199519231 },
    { code: "bom", city: "Mumbai", country: "India", markup: 1.076923077 },
    { code: "cdg", city: "Paris", country: "France", markup: 1.134615385 },
    { code: "sjc", city: "San Jose, California (US)", country: "", markup: 1.192307692 },
    { code: "gru", city: "São Paulo", country: "Brazil", markup: 1.615384615 },
    { code: "ewr", city: "Secaucus, NJ (US)", country: "", markup: 1 },
    { code: "sin", city: "Singapore", country: "Singapore", markup: 1.269230769 },
    { code: "arn", city: "Stockholm", country: "Sweden", markup: 1.038461538 },
    { code: "syd", city: "Sydney", country: "Australia", markup: 1.269230769 },
    { code: "nrt", city: "Tokyo", country: "Japan", markup: 1.307692308 },
    { code: "yyz", city: "Toronto", country: "Canada", markup: 1.115384615 },
  ];

  // Ashburn rates in USD per second. Each vCPU includes 256MB (shared) or 2GB
  // (performance) of RAM; RAM above that is billed per GB.
  const PRICE_PER_VCPU_SECOND = { shared: 0.00000075, performance: 0.00001196 };
  const INCLUDED_RAM_GB_PER_VCPU = { shared: 0.25, performance: 2 };
  const RAM_PRICE_PER_GB_SECOND = 0.00000193;

  // The first RAM size in each preset is the one the preset includes.
  const presets = [
    { name: "shared-cpu-1x", cpu: 1, cpuType: "shared", tiers: ["256MB", "512MB", "1GB", "2GB"] },
    { name: "shared-cpu-2x", cpu: 2, cpuType: "shared", tiers: ["512MB", "1GB", "2GB", "4GB"] },
    { name: "shared-cpu-4x", cpu: 4, cpuType: "shared", tiers: ["1GB", "2GB", "4GB", "8GB"] },
    { name: "shared-cpu-6x", cpu: 6, cpuType: "shared", tiers: ["1.5GB", "3GB", "6GB", "12GB"] },
    { name: "shared-cpu-8x", cpu: 8, cpuType: "shared", tiers: ["2GB", "4GB", "8GB", "16GB"] },
    { name: "performance-1x", cpu: 1, cpuType: "performance", tiers: ["2GB", "4GB", "8GB"] },
    { name: "performance-2x", cpu: 2, cpuType: "performance", tiers: ["4GB", "8GB", "16GB"] },
    { name: "performance-4x", cpu: 4, cpuType: "performance", tiers: ["8GB", "16GB", "32GB"] },
    { name: "performance-6x", cpu: 6, cpuType: "performance", tiers: ["12GB", "24GB", "48GB"] },
    { name: "performance-8x", cpu: 8, cpuType: "performance", tiers: ["16GB", "32GB", "64GB"] },
    { name: "performance-10x", cpu: 10, cpuType: "performance", tiers: ["20GB", "40GB", "80GB"] },
    { name: "performance-12x", cpu: 12, cpuType: "performance", tiers: ["24GB", "48GB", "96GB"] },
    { name: "performance-14x", cpu: 14, cpuType: "performance", tiers: ["28GB", "56GB", "112GB"] },
    { name: "performance-16x", cpu: 16, cpuType: "performance", tiers: ["32GB", "64GB", "128GB"] },
  ];

  const ramGB = (ram) => (ram.endsWith("MB") ? parseFloat(ram) / 1024 : parseFloat(ram));
  const basePricePerSecond = ({ cpu, cpuType }, ram) =>
    cpu * PRICE_PER_VCPU_SECOND[cpuType] +
    (ramGB(ram) - cpu * INCLUDED_RAM_GB_PER_VCPU[cpuType]) * RAM_PRICE_PER_GB_SECOND;

  // Ashburn is the base price the other regions are marked up from.
  const [selected, setSelected] = useState("iad");
  const region = regions.find((r) => r.code === selected) ?? regions[0];

  const SECONDS_PER_HOUR = 3600;
  const SECONDS_PER_MONTH = 2592000; // 30 days
  const BASELINE_RAM_PRICE_PER_30_DAYS = RAM_PRICE_PER_GB_SECOND * SECONDS_PER_MONTH;

  const currencyFormatter = (minimumFractionDigits) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits,
      maximumFractionDigits: 2,
    });
  const monthFormatter = currencyFormatter(2);
  const ramFormatter = currencyFormatter(0);

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
        {ramFormatter.format(BASELINE_RAM_PRICE_PER_30_DAYS * region.markup)} per 30 days per GB of additional RAM.
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
            preset.tiers.map((ram, tierIndex) => {
              const perSecond = basePricePerSecond(preset, ram) * region.markup;
              return (
                <tr key={`${preset.name}-${ram}`}>
                  {tierIndex === 0 && (
                    <>
                      <td rowSpan={preset.tiers.length}>{preset.name}</td>
                      <td rowSpan={preset.tiers.length}>
                        {preset.cpu} {preset.cpuType}
                      </td>
                    </>
                  )}
                  <td>{ram}</td>
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
