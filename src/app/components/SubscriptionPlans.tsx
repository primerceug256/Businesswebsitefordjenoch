// src/app/components/MoviesSection.tsx
import { Ticket } from "lucide-react";

const plans = [
  { time: "2 Hours", price: "500" },
  { time: "6 Hours", price: "800" },
  { time: "24 Hours", price: "1,100" },
  { time: "3 Days", price: "3,500" },
  { time: "Weekly", price: "6,000" },
  { time: "2 Weeks", price: "11,000" },
  { time: "1 Month", price: "19,000" },
  { time: "3 Months", price: "39,500" },
  { time: "6 Months", price: "65,000" },
  { time: "1 Year", price: "110,000" },
  { time: "Unlimited", price: "350,000" },
];

export function MoviesSection() {
  return (
    <section id="movies" className="py-20 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-black uppercase mb-4">Movie Subscription</h2>
        <p className="text-gray-400 mb-12">Pay once and watch everything for the duration chosen!</p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {plans.map((p) => (
            <div key={p.time} className="bg-gray-800 p-4 rounded-xl border border-gray-700 hover:border-orange-500">
              <Ticket className="mx-auto mb-2 text-orange-500" />
              <h3 className="font-bold">{p.time}</h3>
              <p className="text-orange-500 font-black">{p.price} UGX</p>
              <button className="mt-4 w-full bg-orange-600 py-2 rounded font-bold text-xs uppercase">Choose Plan</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}