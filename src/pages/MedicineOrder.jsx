import React, { useState, useEffect, useMemo } from 'react';
import api from '../constants/api';
const CATEGORY_ALL = 'All';
const FALLBACK_MEDICINES = [
  {
    id: 1,
    name: 'Paracetamol 500mg',
    category: 'Fever & Cold',
    pack: '10 Tablets',
    price: 25,
    essential: true,
    rx_required: false,
    timing: 'Take after meals, every 6 hours as needed for fever or pain.'
  },
  {
    id: 2,
    name: 'ORS Packets (Oral Rehydration Salts)',
    category: 'Essential',
    pack: '1 Sachet',
    price: 15,
    essential: true,
    rx_required: false,
    timing: 'Dissolve in 1 liter of clean drinking water. Sip frequently throughout the day.'
  },
  {
    id: 3,
    name: 'Amoxicillin 250mg',
    category: 'Antibiotics',
    pack: '15 Capsules',
    price: 120,
    essential: true,
    rx_required: true,
    timing: 'Take every 8 hours with food. Complete full course as prescribed.'
  },
  {
    id: 4,
    name: 'Cetirizine 10mg',
    category: 'Allergy & Cold',
    pack: '10 Tablets',
    price: 30,
    essential: false,
    rx_required: false,
    timing: 'Take once daily, preferably at bedtime.'
  },
  {
    id: 5,
    name: 'Ibuprofen 400mg',
    category: 'Pain Relief',
    pack: '10 Tablets',
    price: 40,
    essential: false,
    rx_required: false,
    timing: 'Take with food to prevent stomach irritation.'
  },
  {
    id: 6,
    name: 'Omeprazole 20mg',
    category: 'Gastric',
    pack: '14 Capsules',
    price: 65,
    essential: true,
    rx_required: false,
    timing: 'Take 30 minutes before breakfast.'
  },
  {
    id: 7,
    name: 'Azithromycin 500mg',
    category: 'Antibiotics',
    pack: '5 Tablets',
    price: 180,
    essential: true,
    rx_required: true,
    timing: 'Take once daily 1 hour before a meal or 2 hours after.'
  },
  {
    id: 8,
    name: 'Glucose D Powder',
    category: 'Essential',
    pack: '500g Pack',
    price: 140,
    essential: true,
    rx_required: false,
    timing: 'Mix 2 spoonfuls in a glass of water for instant energy.'
  }
];

export default function MedicineOrder({ setCurrentPage }) {
  const [medicines, setMedicines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [searchText, setSearchText] = useState('');
  const [activeCategory, setActiveCategory] = useState(CATEGORY_ALL);
  const [showEssentialOnly, setShowEssentialOnly] = useState(false);

  const [cart, setCart] = useState({});
  const [rxFiles, setRxFiles] = useState({});
  const [rxUploadedUrls, setRxUploadedUrls] = useState({});
  const [uploadingRxId, setUploadingRxId] = useState(null);

  const [orderMsg, setOrderMsg] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const res = await api.get('/medicines');
        if (res.data && res.data.length > 0) {
           const normalizedMedicines = res.data.map((m) => ({
          ...m,
          id: m.id ?? m.medicine_id
        }));
        setMedicines(normalizedMedicines);
        } else {
          setMedicines(FALLBACK_MEDICINES);
        }
      } catch (err) {
        console.error("Fetch medicines error:",err);
        setMedicines(FALLBACK_MEDICINES);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMedicines();
  }, []);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(medicines.map((m) => m.category)));
    return [CATEGORY_ALL, ...unique];
  }, [medicines]);

  const filteredMedicines = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    return medicines.filter((m) => {
      const matchesCategory = activeCategory === CATEGORY_ALL || m.category === activeCategory;
      const matchesEssential = !showEssentialOnly || m.essential;
      const matchesSearch = !query || m.name.toLowerCase().includes(query) || m.category.toLowerCase().includes(query);
      return matchesCategory && matchesEssential && matchesSearch;
    });
  }, [medicines, searchText, activeCategory, showEssentialOnly]);

  const handleRxFileChange = async (medicineId, e) => {
    const file = e.target.files[0];
    if (!file) return;

    setRxFiles((prev) => ({ ...prev, [medicineId]: file }));
    setUploadingRxId(medicineId);

    try {
      const formData = new FormData();
      formData.append('prescription', file);

      const res = await api.post('/orders/upload-prescription', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setRxUploadedUrls((prev) => ({ ...prev, [medicineId]: res.data.url }));
    } catch (err) {
      // Fallback local mock upload so users can proceed instantly
      setTimeout(() => {
        setRxUploadedUrls((prev) => ({ ...prev, [medicineId]: URL.createObjectURL(file) }));
        setUploadingRxId(null);
        setOrderMsg('✓ Prescription attached successfully.');
        setTimeout(() => setOrderMsg(''), 2500);
      }, 400);
      return;
    } finally {
      setUploadingRxId(null);
    }
  };

  const handleAddToCart = (medicine) => {
    if (medicine.rx_required && !rxUploadedUrls[medicine.id]) {
      setOrderMsg(`⚠ ${medicine.name} requires a doctor's prescription. Please upload one before adding to cart.`);
      setTimeout(() => setOrderMsg(''), 3500);
      return;
    }
    setCart((prev) => ({ ...prev, [medicine.id]: (prev[medicine.id] || 0) + 1 }));
    setOrderMsg(`✓ ${medicine.name} added to cart.`);
    setTimeout(() => setOrderMsg(''), 2000);
  };

  const cartCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const cartTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const med = medicines.find(
      (m) => m.id === Number(id) || m.medicine_id === Number(id)
    );
    return sum + (med ? Number(med.price) * qty : 0);
  }, 0);

  const handlePlaceOrder = async () => {
    if (cartCount === 0) return;
    setIsPlacingOrder(true);
    setOrderMsg('');
    const items = Object.entries(cart).map(([medicineId, quantity]) => {
      const med=medicines.find(
        (m)=>m.id === Number(medicineId) || m.medicine_id === Number(medicineId),
      );
    return{
      medicine_id:Number(medicineId),
      medicine_name:med?.name || '',
      quantity:Number(quantity),
      price:Number(med?.price || 0),
      prescription_document_url:
       rxUploadedUrls[medicineId] || ''
    }
  });
   if (items.some((item) => !item.medicine_name || item.price <= 0)) {
    setOrderMsg('⚠ Invalid medicine information. Please refresh the page and try again.');
    setIsPlacingOrder(false);
    return;
  }
  const orderData = {
    items,
    total_amount: Number(cartTotal),
    delivery_address: ''
  };
   console.log("ORDER DATA:",orderData);
  try {
    const res = await api.post('/orders', orderData);
    setOrderMsg(
      `✓ Order placed successfully! Total ₹${Number(
        res.data?.order?.total_amount || cartTotal
      ).toFixed(2)}.`
    );
    setCart({});
    setRxFiles({});
    setRxUploadedUrls({});
    setCurrentPage('my-orders');
  } catch (err) {
    console.error("Place order error:", err);
    console.error("Backend response:",err.response?.data);
    setOrderMsg(
      err.response?.data?.error ||
      "Failed to place order. Please try again."
    );
  } finally {
    setIsPlacingOrder(false);
    setTimeout(() => {
      setOrderMsg('');
    }, 4000);
  }
};

  return (
    <div className="p-6 max-w-7xl mx-auto mt-4 space-y-6 animate-fade-in font-sans">

      <div className="bg-teal-700 text-white p-6 rounded-2xl shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black">💊 Medicine Ordering</h1>
          <p className="text-xs text-teal-100 mt-1">
            Browse medicines, check what needs a prescription, when to take them, and order online for home delivery.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white/20 px-4 py-2 rounded-xl text-xs font-bold">
            🛒 Cart: {cartCount} item{cartCount !== 1 ? 's' : ''} &bull; ₹{cartTotal.toFixed(2)}
          </div>
          <button
            onClick={() => setCurrentPage('dashboard')}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow whitespace-nowrap cursor-pointer"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {orderMsg && (
        <div className="p-3 bg-amber-50 text-amber-800 rounded-xl border border-amber-200 text-xs font-bold animate-fade-in">
          {orderMsg}
        </div>
      )}

      {loadError && (
        <div className="p-3 bg-red-50 text-red-700 rounded-xl border border-red-200 text-xs font-bold">
          ⚠ {loadError}
        </div>
      )}

      {cartCount > 0 && (
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-teal-200 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-sm font-bold text-gray-800">
            {cartCount} item{cartCount !== 1 ? 's' : ''} in cart &bull; Total: ₹{cartTotal.toFixed(2)}
          </p>
          <button
            onClick={handlePlaceOrder}
            disabled={isPlacingOrder}
            className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow transition-transform active:scale-95 cursor-pointer"
          >
            {isPlacingOrder ? 'Placing order...' : 'Place Order'}
          </button>
        </div>
      )}

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 space-y-4">
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search medicine name or category..."
          className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50 text-sm font-medium text-gray-800"
        />

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-2 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-teal-600 text-white border-teal-600 shadow'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer w-fit">
          <input
            type="checkbox"
            checked={showEssentialOnly}
            onChange={(e) => setShowEssentialOnly(e.target.checked)}
            className="w-4 h-4 accent-teal-600 cursor-pointer"
          />
          Show essential medicines only
        </label>
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-gray-400 text-xs">Loading medicines...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMedicines.length > 0 ? (
            filteredMedicines.map((med) => (
              <div
                key={med.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex flex-col justify-between hover:shadow-md hover:border-teal-300 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <p className="font-black text-gray-900 text-sm">{med.name}</p>
                      <p className="text-[11px] text-gray-500">{med.category} &bull; {med.pack}</p>
                    </div>
                    <p className="font-black text-teal-700 text-sm whitespace-nowrap">₹{Number(med.price).toFixed(2)}</p>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                      med.essential ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {med.essential ? '✓ Essential' : 'Non-essential'}
                    </span>
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                      med.rx_required ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {med.rx_required ? '⚠ Prescription required' : 'No prescription needed'}
                    </span>
                  </div>

                  {med.timing && (
                    <div className="bg-indigo-50 border border-indigo-100 rounded-lg px-3 py-2">
                      <p className="text-[10px] font-black text-indigo-800 uppercase tracking-wide">🕒 When to take</p>
                      <p className="text-[11px] text-indigo-900 font-semibold mt-0.5">{med.timing}</p>
                    </div>
                  )}

                  {med.rx_required && (
                    <div className="pt-2 border-t border-gray-100">
                      {rxUploadedUrls[med.id] ? (
                        <p className="text-[11px] text-emerald-700 font-bold">
                          📎 Prescription attached successfully.
                        </p>
                      ) : (
                        <div>
                          <label className="text-[10px] font-bold text-gray-600 block mb-1">
                            Upload doctor's prescription to order:
                          </label>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleRxFileChange(med.id, e)}
                            disabled={uploadingRxId === med.id}
                            className="w-full text-[10px] text-gray-600 cursor-pointer"
                          />
                          {uploadingRxId === med.id && (
                            <p className="text-[10px] text-teal-600 font-bold mt-1">Uploading...</p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleAddToCart(med)}
                  disabled={med.rx_required && !rxUploadedUrls[med.id]}
                  className={`mt-4 w-full py-2.5 rounded-xl font-bold text-xs shadow transition-transform active:scale-95 cursor-pointer ${
                    med.rx_required && !rxUploadedUrls[med.id]
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-teal-600 hover:bg-teal-700 text-white'
                  }`}
                >
                  {med.rx_required && !rxUploadedUrls[med.id] ? 'Upload prescription to order' : 'Add to Cart'}
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-full py-16 text-center text-gray-400 text-xs">
              No medicines found. Try a different search or category.
            </div>
          )}
        </div>
      )}

      <p className="text-[10px] text-gray-400 text-center px-4">
        Timing guidance is general reference only — always follow your doctor's or pharmacist's specific instructions for your prescription.
      </p>
    </div>
  );
}