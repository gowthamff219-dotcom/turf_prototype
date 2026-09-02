const fs = require('fs');
let html = fs.readFileSync('book.html', 'utf8');

// 1. Replace the Checkbox HTML with a Select Dropdown
const oldCheckboxUI = `                        <!-- Extension Checkbox -->
                        <div class="flex items-center space-x-3 bg-white/5 p-4 border border-white/10 rounded-sm cursor-pointer mb-2" onclick="toggleModalExtension()">
                            <input type="checkbox" id="modalExtendToggle" class="w-5 h-5 text-brand-primary border-gray-600 rounded bg-transparent focus:ring-brand-primary" onclick="event.stopPropagation()">
                            <div class="flex-1">
                                <p class="font-bold text-sm text-gray-200 uppercase tracking-wide">Add 30 Mins Extra (+<span id="modalExtraRateText">₹550</span>)</p>
                                <p id="modalExtendHint" class="text-xs text-brand-primary font-bold hidden"></p>
                            </div>
                        </div>
                        <p id="modalExtendError" class="text-red-500 text-xs font-bold hidden mb-6">The next 30 minutes are already booked.</p>`;

const newDurationUI = `                        <!-- Duration Select -->
                        <div class="mb-6">
                            <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Booking Duration</label>
                            <select id="durationSelect" onchange="changeDuration()" class="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white font-bold focus:outline-none focus:border-brand-primary appearance-none">
                                <option value="0" class="text-black">1 Hour (Standard)</option>
                                <option value="0.5" class="text-black">1.5 Hours (+₹<span id="optExtra1">550</span>)</option>
                                <option value="1.0" class="text-black">2 Hours (+₹<span id="optExtra2">1100</span>)</option>
                            </select>
                            <p id="durationError" class="text-red-500 text-xs font-bold hidden mt-2">The selected extended time is not available.</p>
                        </div>`;

html = html.replace(oldCheckboxUI, newDurationUI);

// 2. Change state.isExtended to state.extendDuration
html = html.replace('isExtended: false,', 'extendDuration: 0,');

// 3. Update selectSlot to reset the dropdown
html = html.replace("state.isExtended = false;", "state.extendDuration = 0;");
html = html.replace("document.getElementById('modalExtendToggle').checked = false;", "document.getElementById('durationSelect').value = '0'; document.getElementById('durationError').classList.add('hidden');");

html = html.replace("state.isExtended = false;", "state.extendDuration = 0;"); // resetSelection

// 4. Update dynamic price logic
const selectDateCode = `async function selectDate(dateStr, el) {
            const d = new Date(dateStr);
            const isWeekend = d.getDay() === 0 || d.getDay() === 6;
            BASE_PRICE = isWeekend ? 1300 : 1100;
            EXTRA_PRICE = isWeekend ? 650 : 550;`;
html = html.replace('async function selectDate(dateStr, el) {', selectDateCode);


// 5. Replace toggleModalExtension with changeDuration
const oldToggle = `        function toggleModalExtension() {
            const toggle = document.getElementById('modalExtendToggle');
            const error = document.getElementById('modalExtendError');
            
            // Toggle state if they clicked the container
            toggle.checked = !toggle.checked;
            
            if (toggle.checked && !canExtend()) {
                toggle.checked = false;
                error.classList.remove('hidden');
                return;
            }
            error.classList.add('hidden');
            state.isExtended = toggle.checked;
            updateSummary();
        }`;

const newToggle = `        function changeDuration() {
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

html = html.replace(oldToggle, newToggle);


// 6. Replace canExtend
const oldCanExtend = `        function canExtend() {
            if (state.selectedSlotIndex === null) return false;
            const slot = state.available1HrSlots[state.selectedSlotIndex];
            const nextChunkVal = (slot.endVal).toString(); 
            if (slot.endVal >= CLOSE_HOUR) return false;
            if (state.bookedChunks.includes(nextChunkVal)) return false;
            return true;
        }`;

const newCanExtend = `        function canExtend(extendHours) {
            if (state.selectedSlotIndex === null) return false;
            const slot = state.available1HrSlots[state.selectedSlotIndex];
            
            if (slot.endVal + extendHours > CLOSE_HOUR) return false;
            
            // Check all chunks in the extended period
            let chunksNeeded = extendHours / 0.5;
            for(let i=0; i<chunksNeeded; i++) {
                let chunkVal = (slot.endVal + (i * 0.5)).toString();
                if (state.bookedChunks.includes(chunkVal)) return false;
            }
            return true;
        }`;

html = html.replace(oldCanExtend, newCanExtend);


// 7. Update updateSummary
const oldSummary = `        function updateSummary() {
            document.getElementById('modalRateText').textContent = '₹' + BASE_PRICE;
            document.getElementById('modalExtraRateText').textContent = '₹' + EXTRA_PRICE;
            const slot = state.available1HrSlots[state.selectedSlotIndex];
            if(!slot) return;
            
            let timeStr = slot.slotName;
            if(state.isExtended) {
                const startH = Math.floor(slot.startVal);
                const startDisplay = startH > 12 ? startH - 12 : (startH === 0 ? 12 : startH);
                let eh = Math.floor(slot.startVal + 1.5);
                let ehDisplay = eh > 12 ? eh - 12 : (eh === 0 ? 12 : eh);
                let ampm = eh >= 12 ? 'PM' : 'AM';
                timeStr = \`\${startDisplay}:00 - \${ehDisplay}:30 \${ampm}\`;
            }

            const totalPrice = state.isExtended ? BASE_PRICE + EXTRA_PRICE : BASE_PRICE;
            const balance = totalPrice - ADVANCE_PRICE;

            document.getElementById('modalDate').textContent = state.selectedDate;
            document.getElementById('modalTime').textContent = timeStr;
            document.getElementById('modalBalanceText').textContent = \`Balance ₹\${balance} at Venue\`;
            
            // Show end time hint in extension section
            const hint = document.getElementById('modalExtendHint');
            let eh = Math.floor(slot.startVal + 1.5);
            let ehDisplay = eh > 12 ? eh - 12 : (eh === 0 ? 12 : eh);
            let ampm = eh >= 12 ? 'PM' : 'AM';
            hint.textContent = \`Extends booking to \${ehDisplay}:30 \${ampm}\`;
            hint.classList.remove('hidden');
        }`;

const newSummary = `        function updateSummary() {
            document.getElementById('modalRateText').textContent = '₹' + BASE_PRICE;
            const opt1 = document.getElementById('optExtra1'); if(opt1) opt1.textContent = EXTRA_PRICE;
            const opt2 = document.getElementById('optExtra2'); if(opt2) opt2.textContent = EXTRA_PRICE * 2;
            
            const slot = state.available1HrSlots[state.selectedSlotIndex];
            if(!slot) return;
            
            let timeStr = slot.slotName;
            if(state.extendDuration > 0) {
                const startH = Math.floor(slot.startVal);
                const startDisplay = startH > 12 ? startH - 12 : (startH === 0 ? 12 : startH);
                let eh = slot.endVal + state.extendDuration;
                let ehFloor = Math.floor(eh);
                let ehDisplay = ehFloor > 12 ? ehFloor - 12 : (ehFloor === 0 ? 12 : ehFloor);
                let ampm = ehFloor >= 12 && ehFloor !== 24 ? 'PM' : 'AM';
                let mins = (eh % 1 !== 0) ? ':30' : ':00';
                timeStr = \`\${startDisplay}:00 - \${ehDisplay}\${mins} \${ampm}\`;
            }

            const totalPrice = BASE_PRICE + (state.extendDuration / 0.5) * EXTRA_PRICE;
            const balance = totalPrice - ADVANCE_PRICE;

            document.getElementById('modalDate').textContent = state.selectedDate;
            document.getElementById('modalTime').textContent = timeStr;
            document.getElementById('modalBalanceText').textContent = \`Balance ₹\${balance} at Venue\`;
        }`;

html = html.replace(oldSummary, newSummary);


// 8. Update submitBooking payload
const oldSubmit = `            let requiredChunks = [...slot.internalChunks];
            if (state.isExtended) {
                requiredChunks.push((slot.endVal).toString());
            }

            let timeStr = slot.slotName;
            if(state.isExtended) {
                const startH = Math.floor(slot.startVal);
                const startDisplay = startH > 12 ? startH - 12 : (startH === 0 ? 12 : startH);
                let eh = Math.floor(slot.startVal + 1.5);
                let ehDisplay = eh > 12 ? eh - 12 : (eh === 0 ? 12 : eh);
                let ampm = eh >= 12 ? 'PM' : 'AM';
                timeStr = \`\${startDisplay}:00 - \${ehDisplay}:30 \${ampm}\`;
            }

            const totalPrice = state.isExtended ? BASE_PRICE + EXTRA_PRICE : BASE_PRICE;`;

const newSubmit = `            let requiredChunks = [...slot.internalChunks];
            if (state.extendDuration > 0) {
                let chunksNeeded = state.extendDuration / 0.5;
                for(let i=0; i<chunksNeeded; i++) {
                    requiredChunks.push((slot.endVal + (i * 0.5)).toString());
                }
            }

            let timeStr = slot.slotName;
            if(state.extendDuration > 0) {
                const startH = Math.floor(slot.startVal);
                const startDisplay = startH > 12 ? startH - 12 : (startH === 0 ? 12 : startH);
                let eh = slot.endVal + state.extendDuration;
                let ehFloor = Math.floor(eh);
                let ehDisplay = ehFloor > 12 ? ehFloor - 12 : (ehFloor === 0 ? 12 : ehFloor);
                let ampm = ehFloor >= 12 && ehFloor !== 24 ? 'PM' : 'AM';
                let mins = (eh % 1 !== 0) ? ':30' : ':00';
                timeStr = \`\${startDisplay}:00 - \${ehDisplay}\${mins} \${ampm}\`;
            }

            const totalPrice = BASE_PRICE + (state.extendDuration / 0.5) * EXTRA_PRICE;`;

html = html.replace(oldSubmit, newSubmit);

// also fix the duration string in payload
html = html.replace('duration: state.isExtended ? "1.5 Hours" : "1 Hour",', 'duration: state.extendDuration === 0.5 ? "1.5 Hours" : (state.extendDuration === 1.0 ? "2 Hours" : "1 Hour"),');


fs.writeFileSync('book.html', html, 'utf8');
console.log('DONE');
