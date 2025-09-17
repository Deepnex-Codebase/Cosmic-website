import React from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { FiSun, FiDollarSign, FiHome, FiTrendingUp, FiShield, FiZap, FiTarget, FiBarChart, FiCheckCircle, FiXCircle } from "react-icons/fi";

const fadeUpVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const SolarBusinessModel = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-['Space_Grotesk']">
      <Helmet>
        <title>India's Solar Business Models & Energy Goals | Cosmic Power Tech</title>
        <meta
          name="description"
          content="Explore India's ambitious solar energy goals and comprehensive guide to CAPEX and OPEX/RESCO solar business models for sustainable energy future."
        />
        <meta
          name="keywords"
          content="India solar energy goals, solar business model, CAPEX, OPEX, RESCO, PPA, renewable energy, 500 GW target"
        />
      </Helmet>

      {/* Hero Section */}
      <motion.section
        className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20"
        initial="hidden"
        animate="visible"
        variants={fadeUpVariant}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            India's Ambitious Solar <span className="text-yellow-400">Energy Goals</span>
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-4xl mx-auto">
            Understanding solar business models crucial for India's quest towards a solar-powered future and achieving 500 GW renewable energy capacity by 2030.
          </p>
        </div>
      </motion.section>

      {/* India's Solar Goals */}
      <section className="py-16 max-w-6xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" variants={fadeUpVariant}>
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
            <div className="flex items-center mb-6">
              <FiTarget className="text-3xl text-primary-600 mr-4" />
              <h2 className="text-3xl font-bold text-gray-900">India's Solar Energy Journey</h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-6">
              The solar business model is crucial for determining how solar power plants function in India's quest for a solar-powered future. This model specifies how income is earned, either by selling the energy generated or by using the electricity produced on-site and saving money. At Cosmic Power Tech, we understand that the solar business model affects many aspects, such as who owns the project, how much investment is needed, how operations and maintenance are handled, and what returns the stakeholders can expect.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                <div className="flex items-center mb-4">
                  <FiBarChart className="text-2xl text-green-600 mr-3" />
                  <h3 className="text-xl font-semibold text-green-800">Current Achievement</h3>
                </div>
                <p className="text-green-700 mb-2">
                  <strong>72.31 GW</strong> of installed solar energy capacity as of November 2023
                </p>
                <p className="text-green-600 text-sm">
                  Impressive stride towards the initial target of 100 GW solar capacity
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                <div className="flex items-center mb-4">
                  <FiTarget className="text-2xl text-blue-600 mr-3" />
                  <h3 className="text-xl font-semibold text-blue-800">Future Target</h3>
                </div>
                <p className="text-blue-700 mb-2">
                  <strong>500 GW</strong> renewable energy capacity by 2030
                </p>
                <p className="text-blue-600 text-sm">
                  Includes all forms of renewable energy – solar, wind and more
                </p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border-l-4 border-yellow-400">
              <p className="text-gray-700 italic text-lg">
                "We'll hit that 500 GW well before 2030." - <strong>R.K. Singh</strong>, Union Minister for Power and New & Renewable Energy
              </p>
            </div>
            
            <p className="text-gray-700 leading-relaxed mt-6">
              This bold target reflects not only a numerical success but also India's leadership in the global shift towards clean energy. For businesses in India, partnering with Cosmic Power Tech and choosing the right solar business model paves the way for financial incentives and opportunities, aligning seamlessly with the nation's dedication to a sustainable and brighter future for all.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Business Models Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" variants={fadeUpVariant}>
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
              Two Main Solar Business Models in India
            </h2>
            <p className="text-gray-700 text-center max-w-4xl mx-auto mb-12 text-lg">
              There are two main types of solar business models in India: the <strong>CAPEX model</strong> and the <strong>RESCO model</strong>. Each of these models has its own advantages and disadvantages, depending on the specific needs and preferences of the business owner.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl">
                <div className="flex items-center mb-4">
                  <FiHome className="text-3xl text-blue-600 mr-4" />
                  <h3 className="text-2xl font-bold text-blue-800">CAPEX Model</h3>
                </div>
                <p className="text-blue-700">
                  Full ownership and responsibility for the solar power system with high upfront investment but long-term savings.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl">
                <div className="flex items-center mb-4">
                  <FiZap className="text-3xl text-green-600 mr-4" />
                  <h3 className="text-2xl font-bold text-green-800">OPEX/RESCO Model</h3>
                </div>
                <p className="text-green-700">
                  Third-party ownership with no upfront investment, paying only for electricity generated through PPA.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CAPEX Model Detailed */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" variants={fadeUpVariant}>
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <FiHome className="text-3xl text-blue-600 mr-4" />
                <h2 className="text-3xl font-bold text-blue-800">CAPEX Model Explained</h2>
              </div>
              
              <p className="text-gray-700 leading-relaxed mb-8">
                The CAPEX model involves the business taking full ownership and responsibility for the solar power system. This means the business purchases the solar panels, inverters, and other equipment upfront to install on their property.
              </p>

              {/* CAPEX Model Diagram */}
          <div className="mb-8 text-center">
            <img 
              src="/capex-02-.webp" 
              alt="CAPEX Model Diagram - Capital expenditure model showing direct ownership and investment structure"
              className="w-full max-w-2xl mx-auto h-64 object-contain rounded-lg shadow-lg"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <div className="hidden bg-gray-100 p-8 rounded-lg border-2 border-dashed border-gray-300">
              <div className="text-gray-600">
                <h4 className="font-semibold mb-2">CAPEX Model Structure</h4>
                <p className="text-sm">Direct ownership model where the business makes an upfront capital investment to own the solar system completely.</p>
              </div>
            </div>
          </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Main Elements:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <FiDollarSign className="text-blue-600 mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <strong>High Upfront Investment:</strong> Full capital expenditure costs to purchase and install the solar system
                      </div>
                    </li>
                    <li className="flex items-start">
                      <FiTrendingUp className="text-blue-600 mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <strong>Long Term Savings:</strong> Lowered electricity bills for decades with excellent ROI
                      </div>
                    </li>
                    <li className="flex items-start">
                      <FiShield className="text-blue-600 mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <strong>Full Control:</strong> Complete control over the solar system and maintenance
                      </div>
                    </li>
                    <li className="flex items-start">
                      <FiSun className="text-blue-600 mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <strong>Tax Breaks:</strong> Government incentives like accelerated depreciation and tax credits
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-6 rounded-xl">
                  <h4 className="font-semibold text-blue-800 mb-3">Ideal For:</h4>
                  <p className="text-blue-700 text-sm">
                    Businesses focused on long-term savings, full control, and leveraging tax incentives. The major barrier is the large upfront investment required, but for some, owning their own power plant is worth it for decades of nearly free solar energy.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-green-50 p-6 rounded-xl">
                  <div className="flex items-center mb-4">
                    <FiCheckCircle className="text-green-600 text-xl mr-2" />
                    <h3 className="text-lg font-semibold text-green-800">Pros of CAPEX Model</h3>
                  </div>
                  <ul className="space-y-2 text-green-700 text-sm">
                    <li>• <strong>Long-term Savings:</strong> Lock in low electricity rates for decades, insulating from escalating grid tariffs</li>
                    <li>• <strong>Tax Breaks & Incentives:</strong> Accelerated depreciation and tax credits boost ROI significantly</li>
                    <li>• <strong>Property Value Boost:</strong> Properties with solar systems have higher valuation and fetch better prices</li>
                    <li>• <strong>Control over System:</strong> Full control over operations, maintenance, and system decisions</li>
                  </ul>
                </div>

                <div className="bg-red-50 p-6 rounded-xl">
                  <div className="flex items-center mb-4">
                    <FiXCircle className="text-red-600 text-xl mr-2" />
                    <h3 className="text-lg font-semibold text-red-800">Cons of CAPEX Model</h3>
                  </div>
                  <ul className="space-y-2 text-red-700 text-sm">
                    <li>• <strong>High Upfront Investment:</strong> Substantial capital expenditure requirement upfront</li>
                    <li>• <strong>Maintenance Responsibility:</strong> All maintenance, repairs, and performance risks on owner</li>
                    <li>• <strong>Performance Risks:</strong> Factors like shading, soiling, inverter failure impact generation</li>
                    <li>• <strong>Technology Obsolescence:</strong> System may become outdated, requiring upgrade costs</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* OPEX/RESCO Model Detailed */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" variants={fadeUpVariant}>
            <div className="bg-white rounded-2xl shadow-lg p-8 border">
              <div className="flex items-center mb-6">
                <FiZap className="text-3xl text-green-600 mr-4" />
                <h2 className="text-3xl font-bold text-green-800">OPEX/PPA/RESCO Model Explained</h2>
              </div>
              
              <p className="text-gray-700 leading-relaxed mb-8">
                The OPEX/PPA/RESCO model allows businesses to benefit from solar power without the major upfront investment required of the CAPEX model. In this model, a third party such as a solar energy provider or RESCO (renewable energy service company) will finance, install, operate and maintain the solar power system on your property. As the business owner, you simply pay for the electricity generated by the solar panels based on a predetermined rate and term length outlined in a power purchase agreement (PPA).
              </p>
              
              {/* OPEX Model Diagram */}
              <div className="mb-8 text-center">
                <img 
                  src="/01-business-model.webp" 
                  alt="OPEX/PPA/RESCO Model Diagram - Business model showing third-party ownership and power purchase agreement structure"
                  className="w-full max-w-2xl mx-auto h-64 object-contain rounded-lg shadow-lg"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div className="hidden bg-gray-100 p-8 rounded-lg border-2 border-dashed border-gray-300">
                  <div className="text-gray-600">
                    <h4 className="font-semibold mb-2">OPEX/PPA/RESCO Model Structure</h4>
                    <p className="text-sm">Third-party developer installs and owns the solar system, while you purchase the generated electricity through a Power Purchase Agreement (PPA).</p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">How It Works:</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-green-100 rounded-full p-2 mr-3 mt-1">
                        <span className="text-green-600 font-bold text-sm">1</span>
                      </div>
                      <div>
                        <strong>Third-party Installation:</strong> RESCO finances and installs solar system on your property
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-green-100 rounded-full p-2 mr-3 mt-1">
                        <span className="text-green-600 font-bold text-sm">2</span>
                      </div>
                      <div>
                        <strong>Operation & Maintenance:</strong> RESCO handles all O&M responsibilities and performance risks
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-green-100 rounded-full p-2 mr-3 mt-1">
                        <span className="text-green-600 font-bold text-sm">3</span>
                      </div>
                      <div>
                        <strong>Pay for Power:</strong> You pay only for electricity consumed at predetermined PPA rates
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-6 rounded-xl">
                  <h4 className="font-semibold text-green-800 mb-3">Perfect For:</h4>
                  <p className="text-green-700 text-sm mb-4">
                    Companies with limited capital but high power demand who want immediate cost savings without upfront investment.
                  </p>
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-xs text-gray-600">
                      <strong>Typical PPA Terms:</strong> 15-25 years with fixed or escalating rates, usually 10-20% lower than grid tariffs
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-green-50 p-8 rounded-xl">
                  <div className="flex items-center mb-6">
                    <FiCheckCircle className="text-green-600 text-2xl mr-3" />
                    <h3 className="text-2xl font-semibold text-green-800">Pros of OPEX/PPA/RESCO Model</h3>
                  </div>
                  <p className="text-green-700 mb-6">
                    The OPEX/PPA/RESCO model offers several key advantages that make it an attractive option for many businesses looking to adopt solar power:
                  </p>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-green-800 mb-3">No Upfront Costs</h4>
                      <p className="text-green-700 text-sm leading-relaxed">
                        One of the biggest pros of the OPEX model is that there are zero upfront costs for the business owner. The RESCO handles the entire initial investment for purchasing and installing the solar panels and equipment. This allows businesses to avoid the huge capital expenditure required to buy their own solar power system. The business simply pays for the electricity generated by the system on a per unit basis. This predictable electricity bill each month is the only cost.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold text-green-800 mb-3">Low Maintenance</h4>
                      <p className="text-green-700 text-sm leading-relaxed">
                        With an OPEX contract, the RESCO is responsible for all maintenance and repairs related to the solar power system. So the panels, inverters, wiring etc. are all looked after by the RESCO. The business owner does not have to worry about system upkeep or finding technicians to service the equipment as needed. This makes it a hassle-free arrangement.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold text-green-800 mb-3">Easy to Scale Over Time</h4>
                      <p className="text-green-700 text-sm leading-relaxed">
                        A major advantage of the OPEX model is the flexibility it offers in system sizing. If the business grows and energy needs increase, it's easy to adjust the PPA and add more solar panels to scale up power generation. There's no need for the business to make additional capital investments to expand the system. The RESCO handles upgrading the equipment as required. This scalability makes it easy to right-size the solar system for current energy needs.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 p-8 rounded-xl">
                  <div className="flex items-center mb-6">
                    <FiXCircle className="text-red-600 text-2xl mr-3" />
                    <h3 className="text-2xl font-semibold text-red-800">Cons of OPEX/PPA/RESCO Model</h3>
                  </div>
                  <p className="text-red-700 mb-6">
                    The OPEX/PPA/RESCO model isn't without its downsides. Here are some potential cons to consider:
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <span className="text-red-600 mr-3 mt-1">•</span>
                      <div>
                        <strong className="text-red-800">Less control over the system:</strong>
                        <span className="text-red-700 text-sm"> Since you don't own the solar power system, you have less control over it. You can't make changes or upgrades without approval from the RESCO.</span>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <span className="text-red-600 mr-3 mt-1">•</span>
                      <div>
                        <strong className="text-red-800">Potentially higher electricity costs:</strong>
                        <span className="text-red-700 text-sm"> While you avoid the upfront investment, the electricity rates per unit could end up costing more over the long run compared to owning your own system. The RESCO needs to recover their initial investment and make a profit.</span>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <span className="text-red-600 mr-3 mt-1">•</span>
                      <div>
                        <strong className="text-red-800">Locked into a long term contract:</strong>
                        <span className="text-red-700 text-sm"> OPEX/PPA/RESCO contracts typically range from 10-15 years – that's a long-term commitment with little flexibility to change providers. It's like signing up for a marriage to sunshine where divorce is not an option. Make sure you're comfortable being tied to one RESCO for decades.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Comparison & Decision Guide */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" variants={fadeUpVariant}>
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
              Choosing the Right Solar Business Model
            </h2>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg mb-12">
              <p className="text-gray-700 leading-relaxed mb-6">
                When selecting a solar business model, it's important to reflect on your budget constraints, risk tolerance, and long-term goals. The CAPEX model may be the best fit if you want more control over your energy source along with tax deductions and incentives. Since you own the system under CAPEX, you benefit directly from government solar subsidies and accelerated depreciation. This allows you to maximize savings over the lifespan of the panels. Just keep in mind that the upfront costs will be higher and you take on more maintenance responsibility.
              </p>
              
              <p className="text-gray-700 leading-relaxed mb-6">
                For businesses that want to avoid high initial investments, the OPEX model is very appealing. The third party finance provider shoulders the upfront panel and installation costs, so you can start benefiting from solar right away. However, electricity rates are slightly higher than the CAPEX model over the long run. And maintenance becomes the responsibility of the RESCO, not you.
              </p>
              
              <p className="text-gray-700 leading-relaxed">
                Ultimately, choosing between CAPEX and OPEX depends on your budget, tolerance for risk, and goals for long-term savings or low initial outlay. Analyze your specific business needs to determine if the benefits of control and tax incentives outweigh the convenience and low startup costs. With the right solar model powering your company, you'll be well on your way to joining India's renewable energy revolution!
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-blue-50 p-8 rounded-2xl border-2 border-blue-200">
                <h3 className="text-2xl font-bold text-blue-800 mb-4">Choose CAPEX If:</h3>
                <ul className="space-y-3 text-blue-700">
                  <li className="flex items-start">
                    <FiCheckCircle className="text-blue-600 mr-3 mt-1 flex-shrink-0" />
                    You have sufficient upfront capital available
                  </li>
                  <li className="flex items-start">
                    <FiCheckCircle className="text-blue-600 mr-3 mt-1 flex-shrink-0" />
                    You want maximum long-term savings and ROI
                  </li>
                  <li className="flex items-start">
                    <FiCheckCircle className="text-blue-600 mr-3 mt-1 flex-shrink-0" />
                    You prefer full control over your energy system
                  </li>
                  <li className="flex items-start">
                    <FiCheckCircle className="text-blue-600 mr-3 mt-1 flex-shrink-0" />
                    You can leverage tax benefits and depreciation
                  </li>
                </ul>
              </div>
              
              <div className="bg-green-50 p-8 rounded-2xl border-2 border-green-200">
                <h3 className="text-2xl font-bold text-green-800 mb-4">Choose OPEX If:</h3>
                <ul className="space-y-3 text-green-700">
                  <li className="flex items-start">
                    <FiCheckCircle className="text-green-600 mr-3 mt-1 flex-shrink-0" />
                    You have limited capital but high power demand
                  </li>
                  <li className="flex items-start">
                    <FiCheckCircle className="text-green-600 mr-3 mt-1 flex-shrink-0" />
                    You want immediate cost savings without investment
                  </li>
                  <li className="flex items-start">
                    <FiCheckCircle className="text-green-600 mr-3 mt-1 flex-shrink-0" />
                    You prefer to avoid maintenance responsibilities
                  </li>
                  <li className="flex items-start">
                    <FiCheckCircle className="text-green-600 mr-3 mt-1 flex-shrink-0" />
                    You want professional risk management
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Financial Impact Comparison
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-4">Aspect</th>
                      <th className="text-center py-3 px-4 text-blue-700">CAPEX Model</th>
                      <th className="text-center py-3 px-4 text-green-700">OPEX/RESCO Model</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="py-3 px-4 font-medium">Upfront Investment</td>
                      <td className="py-3 px-4 text-center text-red-600">High (₹40-60 lakhs/MW)</td>
                      <td className="py-3 px-4 text-center text-green-600">Zero</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium">Electricity Cost</td>
                      <td className="py-3 px-4 text-center text-blue-600">₹2.5-4/unit</td>
                      <td className="py-3 px-4 text-center text-green-600">₹3.5-5.5/unit</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium">Payback Period</td>
                      <td className="py-3 px-4 text-center text-blue-600">3-5 years</td>
                      <td className="py-3 px-4 text-center text-green-600">Immediate savings</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium">25-Year Savings</td>
                      <td className="py-3 px-4 text-center text-blue-600">Higher (₹2-3 crores/MW)</td>
                      <td className="py-3 px-4 text-center text-green-600">Moderate (₹1-1.5 crores/MW)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Investing in Sustainable Future */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" variants={fadeUpVariant}>
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
              Investing in a Sustainable Future
            </h2>
            
            <div className="bg-gradient-to-br from-green-50 to-blue-50 p-8 rounded-2xl shadow-lg mb-8">
              <p className="text-gray-700 leading-relaxed mb-6">
                With India's ambitious solar energy goals, businesses have an incredible opportunity to invest in a more sustainable future. Going solar doesn't just make economic sense; it benefits the environment and allows companies to demonstrate social responsibility.
              </p>
              
              <p className="text-gray-700 leading-relaxed mb-6">
                Solar energy generates power without any air or water pollution, reducing dependence on fossil fuels. Widespread adoption of solar can significantly lower India's carbon emissions and improve air quality. Businesses that install solar panels lead by example and show that profitability and sustainability can go hand in hand.
              </p>
              
              <p className="text-gray-700 leading-relaxed mb-6">
                India is also demonstrating global leadership in clean energy through its massive push for solar power capacity. The country's commitment to adding 500 GW of renewable energy by 2030 sets an example for nations worldwide. When Indian companies adopt solar, they become part of this clean energy success story.
              </p>
              
              <p className="text-gray-700 leading-relaxed mb-6">
                By choosing solar, businesses can power their operations sustainably for decades to come. The sun provides an endless, clean energy source. Investing in solar technology allows companies to reduce their environmental impact and become stewards of a greener future.
              </p>
              
              <p className="text-gray-700 leading-relaxed">
                Going solar makes sense financially and ethically. With two attractive models to choose from, every forward-thinking business can find a way to profit from the power of the sun while advancing India's renewable energy revolution. Leading this sustainability drive will enable the country to shine bright as a beacon of climate action and progressive vision.
              </p>
            </div>
            
           
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-8 rounded-2xl shadow-lg text-center">
              <h3 className="text-2xl font-bold mb-4">🌞 Solarize Bharat 🇮🇳</h3>
              <p className="mb-4 leading-relaxed">
                Take the next step in renewable energy by joining the Solarize Bharat pledge. Imagine your business not just as an entity benefiting from solar power but as a contributor to a nationwide movement, shaping the future of energy in our incredible nation.
              </p>
              <p className="font-semibold text-yellow-200">
                Stay solar-powered and environmentally inspired!
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Conclusion */}
      <motion.section
        className="py-20 bg-gradient-to-r from-primary-600 to-primary-700 text-white"
        initial="hidden"
        whileInView="visible"
        variants={fadeUpVariant}
      >
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Investing in India's Sustainable Future with Cosmic Power Tech</h2>
          <p className="text-lg opacity-90 mb-8">
            Whether you choose CAPEX or OPEX, going solar with Cosmic Power Tech helps reduce costs, ensure energy security, and contribute to India's ambitious 500 GW renewable energy target by 2030. The right model ensures maximum financial and environmental benefits while supporting the nation's clean energy leadership.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105"
            >
              Get Expert Consultation from Cosmic Power Tech
            </a>
            <a
              href="/services"
              className="border-2 border-white text-white hover:bg-white hover:text-primary-700 px-8 py-4 rounded-full font-semibold transition-all duration-300"
            >
              Explore Cosmic Power Tech Services
            </a>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default SolarBusinessModel;
