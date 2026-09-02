const fs = require('fs');
let html = fs.readFileSync('book.html', 'utf8');

// Replace the dropdown UI with two checkbox cards
const dropdownUI = `                        <!-- Duration Select -->
                        <div class="mb-6">
                            <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Booking Duration</label>
                            <select id="durationSelect" onchange="changeDuration()" class="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white font-bold focus:outline-none focus:border-brand-primary appearance-none">
                                <option value="0" class="text-black">1 Hour (Standard)</option>
                                <option value="0.5" class="text-black">1.5 Hours (+₹<span id="optExtra1">550</span>)</option>
                                <option value="1.0" class="text-black">2 Hours (+₹<span id="optExtra2">1100</span>)</option>
                            </select>
                            <p id="durationError" class="text-red-500 text-xs font-bold hidden mt-2">The selected extended time is not available.</p>
                        </div>`;

const checkboxesUI = `                        <!-- Extension Checkboxes -->
                        <div class="mb-6">
                            <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Extend Booking</label>
                            
                            <div class="flex items-center space-x-3 bg-white/5 p-4 border border-white/10 rounded-sm cursor-pointer mb-2" onclick="toggleDuration(0.5)">
                                <input type="checkbox" id="chk30" class="w-5 h-5 text-brand-primary border-gray-600 rounded bg-transparent focus:ring-brand-primary pointer-events-none">
                                <div class="flex-1">
                                    <p class="font-bold text-sm text-gray-200 uppercase tracking-wide">Add 30 Mins Extra (+₹<span id="optExtra1">550</span>)</p>
                                </div>
                            </div>

                            <div class="flex items-center space-x-3 bg-white/5 p-4 border border-white/10 rounded-sm cursor-pointer mb-2" onclick="toggleDuration(1.0)">
                                <input type="checkbox" id="chk60" class="w-5 h-5 text-brand-primary border-gray-600 rounded bg-transparent focus:ring-brand-primary pointer-events-none">
                                <div class="flex-1">
                                    <p class="font-bold text-sm text-gray-200 uppercase tracking-wide">Add 1 Hour Extra (+₹<span id="optExtra2">1100</span>)</p>
                                </div>
                            </div>

                            <p id="durationError" class="text-red-500 text-xs font-bold hidden mt-2">The selected extended time is not available.</p>
                        </div>`;

html = html.replace(dropdownUI, checkboxesUI);


// Replace changeDuration() with toggleDuration()
const oldToggle = `        function changeDuration() {
            const select = document.getElementById('durationSelect');
            const error = document.getElementById('durationError');
            const requestedExt = parseFloat(select.value);
            
            if (requestedExt > 0 && !canExtend(requestedExt)) {
                select.value = "0"; // fallback
                error.classList.remove('hidden');
                state.extendDuration = 0;
            } else {
                error.classList.add('hidden');
                state.extendDuration = requestedExt;
            }
            updateSummary();
        }`;

const newToggle = `        function toggleDuration(ext) {
            const error = document.getElementById('durationError');
            
            if (state.extendDuration === ext) {
                state.extendDuration = 0; // uncheck
            } else {
                if (!canExtend(ext)) {
                    error.classList.remove('hidden');
                    return; // do not update checkboxes or state
                }
                state.extendDuration = ext;
            }
            
            error.classList.add('hidden');
            document.getElementById('chk30').checked = (state.extendDuration === 0.5);
            document.getElementById('chk60').checked = (state.extendDuration === 1.0);
            updateSummary();
        }`;

html = html.replace(oldToggle, newToggle);


// Also fix the slot initialization where it resets the dropdown
html = html.replace(
    "document.getElementById('durationSelect').value = '0'; document.getElementById('durationError').classList.add('hidden');",
    "document.getElementById('chk30').checked = false; document.getElementById('chk60').checked = false; document.getElementById('durationError').classList.add('hidden');"
);

fs.writeFileSync('book.html', html, 'utf8');
console.log('DONE');
