const fs = require('fs');
let html = fs.readFileSync('book.html', 'utf8');

const paymentSection = `
                <!-- Step 3: Payment Details -->
                <div id="stepPayment" class="hidden mt-12 pt-10 border-t border-white/10 animate-fade-in">
                    <h3 class="text-xl font-bold uppercase tracking-widest mb-6 flex items-center">
                        <span class="w-8 h-8 rounded-full bg-brand-primary text-brand-dark flex items-center justify-center mr-3 font-display">3</span> 
                        Confirm & Pay
                    </h3>
                    
                    <div class="bg-black/50 border border-white/5 rounded-xl p-6 sm:p-8">
                        <p class="font-bold text-gray-500 text-sm mb-1">
                            5TH YARD TURF (₹1100/hr) - Football / Cricket Turf
                        </p>
                        <p class="font-bold text-gray-300 mb-6">
                            <span id="modalDate"></span> @ <span id="modalTime"></span>
                        </p>

                        <div class="grid sm:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Player Name</label>
                                <input type="text" id="custName" class="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-brand-primary font-bold" placeholder="">
                            </div>
                            
                            <div>
                                <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Phone Number</label>
                                <input type="tel" id="authPhone" class="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-brand-primary font-bold" placeholder="">
                            </div>
                        </div>

                        <!-- Extension Checkbox -->
                        <div class="flex items-center space-x-3 bg-white/5 p-4 border border-white/10 rounded-sm cursor-pointer mb-2" onclick="toggleModalExtension()">
                            <input type="checkbox" id="modalExtendToggle" class="w-5 h-5 text-brand-primary border-gray-600 rounded bg-transparent focus:ring-brand-primary" onclick="event.stopPropagation()">
                            <div class="flex-1">
                                <p class="font-bold text-sm text-gray-200 uppercase tracking-wide">Add 30 Mins Extra (+₹550)</p>
                                <p id="modalExtendHint" class="text-xs text-brand-primary font-bold hidden"></p>
                            </div>
                        </div>
                        <p id="modalExtendError" class="text-red-500 text-xs font-bold hidden mb-6">The next 30 minutes are already booked.</p>

                        <div class="mt-6 mb-8">
                            <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Payment Method</label>
                            <select id="payMethod" class="w-full sm:w-1/2 bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white font-bold focus:outline-none focus:border-brand-primary appearance-none">
                                <option value="UPI" class="text-black">UPI (GPay, PhonePe, Paytm)</option>
                                <option value="Card" class="text-black">Credit / Debit Card</option>
                            </select>
                        </div>

                        <!-- Price Box -->
                        <div class="bg-brand-primary/10 border border-brand-primary/30 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center rounded-sm mb-6">
                            <div class="mb-2 sm:mb-0">
                                <span class="block text-xs font-bold uppercase tracking-wider text-brand-primary">Advance to Pay Now</span>
                                <span class="block text-[11px] font-bold uppercase text-gray-400 mt-1" id="modalBalanceText">Balance ₹600 at Venue</span>
                            </div>
                            <span class="text-4xl font-display font-bold text-brand-primary">₹500</span>
                        </div>

                        <div class="flex space-x-4">
                            <button id="confirmBtn" onclick="submitBooking()" class="flex-1 bg-brand-primary text-brand-dark font-display font-bold text-xl py-4 rounded-sm uppercase tracking-widest hover:bg-white transition-colors">
                                Pay & Book Now
                            </button>
                        </div>
                    </div>
                </div>
`;

html = html.replace('<!-- Inline sections removed for Modal approach -->', paymentSection);

const modalStart = '<!-- Confirm Booking Modal (Based on User Design) -->';
const modalEnd = '<!-- Manage Bookings Modal -->';
const modalStartIndex = html.indexOf(modalStart);
const modalEndIndex = html.indexOf(modalEnd);

if(modalStartIndex > -1 && modalEndIndex > -1) {
    html = html.substring(0, modalStartIndex) + html.substring(modalEndIndex);
}

html = html.replace("document.getElementById('bookingModal').classList.remove('hidden');", "document.getElementById('stepPayment').classList.remove('hidden');\n            document.getElementById('stepPayment').scrollIntoView({ behavior: 'smooth' });");
html = html.replace("document.getElementById('bookingModal').classList.add('hidden');", "document.getElementById('stepPayment').classList.add('hidden');");

html = html.replace("bg-[#00e676]", "bg-brand-primary");

fs.writeFileSync('book.html', html, 'utf8');
console.log('DONE');
