 (function() {
        // ==================== LOAD DATA FROM LOCALSTORAGE ====================
        let students = JSON.parse(localStorage.getItem('students')) || null;
        let fees = JSON.parse(localStorage.getItem('fees')) || null;
        let receiptCounter = parseInt(localStorage.getItem('receiptCounter')) || 1;
        
        if (!students) {
            students = [
                { id: 'ST-2026-101', name: 'Hira Akhtar', phone: '0312 3456789', course: 'English language', monthlyFee: 4200, admission: '2026-02-12', status: 'Active' },
                { id: 'ST-2026-102', name: 'Rayan Anwar', phone: '0300 7654321', course: 'Web development', monthlyFee: 5800, admission: '2026-01-20', status: 'Active' },
                { id: 'ST-2026-103', name: 'Fatima Zafar', phone: '0321 1239876', course: 'English language', monthlyFee: 4200, admission: '2026-02-05', status: 'Active' },
                { id: 'ST-2026-104', name: 'Ahmed Raza', phone: '0333 4567890', course: 'Mathematics', monthlyFee: 5000, admission: '2026-02-15', status: 'Active' },
                { id: 'ST-2026-105', name: 'Zara Khan', phone: '0311 9876543', course: 'Physics', monthlyFee: 4800, admission: '2026-01-15', status: 'Active' },
                { id: 'ST-2026-106', name: 'Ali Hassan', phone: '0345 1122334', course: 'Chemistry', monthlyFee: 4500, admission: '2026-02-01', status: 'Active' }
            ];
            localStorage.setItem('students', JSON.stringify(students));
        }
        
        if (!fees) {
            fees = [
                { studentId: 'ST-2026-101', month: '2026-02', totalFee: 4200, paid: 2000, remaining: 2200, status: 'Partial', paymentDate: '2026-02-14', method: 'Cash' },
                { studentId: 'ST-2026-102', month: '2026-02', totalFee: 5800, paid: 5800, remaining: 0, status: 'Paid', paymentDate: '2026-02-10', method: 'Card' },
                { studentId: 'ST-2026-103', month: '2026-02', totalFee: 4200, paid: 0, remaining: 4200, status: 'Unpaid', paymentDate: '', method: '' },
                { studentId: 'ST-2026-104', month: '2026-02', totalFee: 5000, paid: 0, remaining: 5000, status: 'Unpaid', paymentDate: '', method: '' },
                { studentId: 'ST-2026-105', month: '2026-02', totalFee: 4800, paid: 2400, remaining: 2400, status: 'Partial', paymentDate: '2026-02-18', method: 'Bank Transfer' },
                { studentId: 'ST-2026-101', month: '2026-01', totalFee: 4200, paid: 1500, remaining: 2700, status: 'Partial', paymentDate: '2026-01-28', method: 'Cash' },
                { studentId: 'ST-2026-102', month: '2026-01', totalFee: 5800, paid: 5800, remaining: 0, status: 'Paid', paymentDate: '2026-01-25', method: 'Cash' },
                { studentId: 'ST-2026-103', month: '2026-01', totalFee: 4200, paid: 4200, remaining: 0, status: 'Paid', paymentDate: '2026-01-10', method: 'Card' },
                { studentId: 'ST-2026-105', month: '2026-01', totalFee: 4800, paid: 0, remaining: 4800, status: 'Unpaid', paymentDate: '', method: '' },
                { studentId: 'ST-2026-106', month: '2026-01', totalFee: 4500, paid: 4500, remaining: 0, status: 'Paid', paymentDate: '2026-01-05', method: 'Cash' }
            ];
            localStorage.setItem('fees', JSON.stringify(fees));
        }

        let studentToDelete = null;

        // ==================== HELPER FUNCTIONS ====================
        function getUnpaidStudentsForMonth(month) {
            return students.filter(student => {
                const feeRecord = fees.find(f => f.studentId === student.id && f.month === month);
                if (!feeRecord) return true;
                return feeRecord.status !== 'Paid';
            });
        }
        
        function updateUnpaidCount() {
            const month = document.getElementById('feeMonth')?.value || '2026-02';
            const unpaidStudents = getUnpaidStudentsForMonth(month);
            document.getElementById('unpaidCount').textContent = unpaidStudents.length;
        }
        
        function updateFeeStudentDropdown() {
            const monthInput = document.getElementById('feeMonth');
            const showUnpaidCheckbox = document.getElementById('showUnpaidOnly');
            
            if (!monthInput || !showUnpaidCheckbox) return;
            
            const month = monthInput.value;
            const showUnpaidOnly = showUnpaidCheckbox.checked;
            let studentList = students;
            
            if (showUnpaidOnly) {
                studentList = getUnpaidStudentsForMonth(month);
            }
            
            const select = document.getElementById('feeStudent');
            if (!select) return;
            
            const currentSelected = select.value;
            
            select.innerHTML = studentList.map(s => 
                `<option value="${s.id}" ${s.id === currentSelected ? 'selected' : ''}>${s.name} (${s.id})</option>`
            ).join('');
            
            const payBtn = document.getElementById('payFeeBtn');
            if (studentList.length === 0) {
                select.innerHTML = '<option value="">No unpaid students found</option>';
                select.disabled = true;
                if (payBtn) payBtn.disabled = true;
            } else {
                select.disabled = false;
                if (payBtn) payBtn.disabled = false;
                
                if (currentSelected && studentList.some(s => s.id === currentSelected)) {
                    select.value = currentSelected;
                } else if (studentList.length > 0) {
                    select.value = studentList[0].id;
                }
            }
            
            updateTotal();
            updateUnpaidCount();
        }

        const findStudent = id => students.find(s => s.id === id);

        function saveToLocalStorage() {
            localStorage.setItem('students', JSON.stringify(students));
            localStorage.setItem('fees', JSON.stringify(fees));
            localStorage.setItem('receiptCounter', receiptCounter.toString());
        }

        window.deleteStudent = function(studentId) {
            studentToDelete = studentId;
            let student = findStudent(studentId);
            document.getElementById('confirmMessage').innerHTML = `Delete <strong>${student.name}</strong>?`;
            document.getElementById('confirmModal').style.display = 'flex';
        };

        window.closeConfirmModal = function() {
            document.getElementById('confirmModal').style.display = 'none';
            studentToDelete = null;
        };

        document.getElementById('confirmDeleteBtn').addEventListener('click', function() {
            if (studentToDelete) {
                students = students.filter(s => s.id !== studentToDelete);
                fees = fees.filter(f => f.studentId !== studentToDelete);
                saveToLocalStorage();
                closeConfirmModal();
                refreshUI();
                setTimeout(() => alert('✅ Student deleted!'), 300);
            }
        });

        window.deleteFee = function(studentId, month) {
            let fee = fees.find(f => f.studentId === studentId && f.month === month);
            if (!fee) return alert('Fee record not found!');
            
            if (confirm(`Delete fee record for ${month}?`)) {
                fees = fees.filter(f => !(f.studentId === studentId && f.month === month));
                saveToLocalStorage();
                refreshUI();
                setTimeout(() => alert('✅ Fee record deleted!'), 300);
            }
        };

        function refreshUI() {
            let monthSelect = document.getElementById('dashboardMonth');
            let month = monthSelect ? monthSelect.value : '2026-02';
            let fMonth = fees.filter(f => f.month === month);
            
            let totalColl = fMonth.reduce((a,f) => a + f.paid, 0);
            let totalUnpaid = fMonth.filter(f => f.status === 'Unpaid').reduce((a,f) => a + f.remaining, 0);
            let paidCount = fMonth.filter(f => f.status === 'Paid').length;
            let partialCount = fMonth.filter(f => f.status === 'Partial').length;

            document.getElementById('dashTotal').innerText = students.length;
            document.getElementById('dashCollect').innerText = '₹' + totalColl.toLocaleString();
            document.getElementById('dashUnpaid').innerText = '₹' + totalUnpaid.toLocaleString();
            document.getElementById('dashPaidCount').innerText = paidCount;
            document.getElementById('dashPartial').innerText = partialCount;

            let search = document.getElementById('studentSearch')?.value.toLowerCase() || '';
            let filteredStd = students.filter(s => s.name.toLowerCase().includes(search));
            
            document.getElementById('studentList').innerHTML = filteredStd.map(s => {
                let studentFee = fees.find(f => f.studentId === s.id && f.month === month);
                let paymentStatus = studentFee ? studentFee.status : 'No record';
                let statusColor = paymentStatus === 'Paid' ? 'var(--success)' : (paymentStatus === 'Partial' ? 'var(--warning)' : 'var(--danger)');
                
                return `
                <div class="student-item">
                    <div class="student-info">
                        <span>${s.name}</span>
                        <span>${s.course} | ${s.phone}</span>
                    </div>
                    <div class="student-actions">
                        <span style="color: ${statusColor}; font-weight: 600; padding: 5px 14px;">${paymentStatus}</span>
                        <button class="delete-btn" onclick="deleteStudent('${s.id}')" title="Delete">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>`;
            }).join('') || '<p style="text-align: center; padding: 2rem; color: var(--text-muted);">No students found</p>';

            updateFeeStudentDropdown();

            let feeSearch = document.getElementById('feeSearch')?.value.toLowerCase() || '';
            let monthFilter = document.getElementById('feeMonthFilter')?.value || '';
            let statusFilter = document.getElementById('feeStatusFilter')?.value || '';
            
            let filteredFees = fees.filter(f => {
                let s = findStudent(f.studentId);
                let nameMatch = s?.name.toLowerCase().includes(feeSearch);
                let monthMatch = monthFilter ? f.month === monthFilter : true;
                let statusMatch = statusFilter ? f.status === statusFilter : true;
                return nameMatch && monthMatch && statusMatch;
            });
            
            let tbody = document.getElementById('feesTable');
            if (tbody) {
                tbody.innerHTML = filteredFees.map(f => {
                    let s = findStudent(f.studentId);
                    let statusClass = f.status === 'Paid' ? 'status-paid' : (f.status === 'Partial' ? 'status-partial' : 'status-unpaid');
                    return `<tr>
                        <td>${s?.name || 'Deleted'}</td>
                        <td>${f.month}</td>
                        <td>₹${f.totalFee.toLocaleString()}</td>
                        <td>₹${f.paid.toLocaleString()}</td>
                        <td>₹${f.remaining.toLocaleString()}</td>
                        <td><span class="${statusClass}">${f.status}</span></td>
                        <td>
                            <div class="action-buttons">
                                <button class="btn-outline btn-sm" onclick="showReceipt('${f.studentId}','${f.month}')">
                                    <i class="fas fa-file-invoice"></i>
                                </button>
                                <button class="btn-danger-outline btn-sm" onclick="deleteFee('${f.studentId}','${f.month}')">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </div>
                        </td>
                    </tr>`;
                }).join('');
            }

            let totalMonth = fees.filter(f => f.month === '2026-02').reduce((a,f) => a + f.totalFee, 0);
            let collMonth = fees.filter(f => f.month === '2026-02').reduce((a,f) => a + f.paid, 0);
            
            document.getElementById('reportMonthly').innerHTML = `
                <p><strong>Total:</strong> ₹${totalMonth.toLocaleString()}</p>
                <p><strong>Collected:</strong> ₹${collMonth.toLocaleString()}</p>
                <p style="margin-top: 8px; padding-top: 8px; border-top: 1px solid var(--border-light);">
                    <strong>Collection Rate:</strong> <span style="color: var(--success);">${Math.round((collMonth/totalMonth)*100)}%</span>
                </p>
            `;
            
            let unpaidFees = fees.filter(f => f.status === 'Unpaid').map(f => {
                let s = findStudent(f.studentId);
                return `<div class="unpaid-item">❌ ${s?.name || 'Deleted'} <span style="color: var(--danger);">₹${f.remaining.toLocaleString()}</span></div>`;
            }).join('');
            document.getElementById('reportUnpaid').innerHTML = unpaidFees || '<p style="padding: 10px; text-align: center; color: var(--success);">✅ All fees paid!</p>';

            let history = fees.slice().reverse().map(f => {
                let s = findStudent(f.studentId);
                let iconClass = f.status === 'Paid' ? 'paid' : (f.status === 'Partial' ? 'partial' : 'unpaid');
                let icon = f.status === 'Paid' ? '✓' : (f.status === 'Partial' ? '⚠' : '✗');
                return `<div class="history-item">
                    <div class="history-icon ${iconClass}">${icon}</div>
                    <div>
                        <div style="font-weight: 500;">${s?.name || 'Deleted'}</div>
                        <div style="color: var(--text-muted); font-size: 0.9rem;">${f.month} • ₹${f.paid.toLocaleString()} • ${f.status}</div>
                    </div>
                </div>`;
            }).join('');
            document.getElementById('reportHistory').innerHTML = history || '<p style="padding: 10px; text-align: center; color: var(--text-muted);">No history</p>';
        }

        function updateTotal() {
            let sid = document.getElementById('feeStudent')?.value;
            let s = findStudent(sid);
            if (s) document.getElementById('feeTotal').value = s.monthlyFee;
        }

        window.showReceipt = function(studentId, month) {
            let fee = fees.find(f => f.studentId === studentId && f.month === month);
            if (!fee) return alert('Fee record not found');
            let student = findStudent(studentId);
            let recNo = `REC-2026-${String(receiptCounter++).padStart(3,'0')}`;
            
            localStorage.setItem('receiptCounter', receiptCounter.toString());
            
            document.getElementById('receiptNumber').textContent = `Receipt # ${recNo}`;
            document.getElementById('receiptStudentInfo').innerHTML = `
                <div class="receipt-row"><span>Student:</span> <strong>${student?.name || 'Unknown'}</strong></div>
                <div class="receipt-row"><span>Course:</span> <strong>${student?.course || 'N/A'}</strong></div>
                <div class="receipt-row"><span>Month:</span> <strong>${month}</strong></div>
                <div class="receipt-row"><span>Payment Date:</span> <strong>${fee.paymentDate || new Date().toLocaleDateString()}</strong></div>
            `;
            
            document.querySelector('.receipt-details:nth-of-type(2)').innerHTML = `
                <div class="receipt-row"><span>Total Fee:</span> <strong>₹${fee.totalFee.toLocaleString()}</strong></div>
                <div class="receipt-row"><span>Amount Paid:</span> <strong>₹${fee.paid.toLocaleString()}</strong></div>
                <div class="receipt-row"><span>Remaining:</span> <strong>₹${fee.remaining.toLocaleString()}</strong></div>
                <div class="receipt-row"><span>Method:</span> <strong>${fee.method}</strong></div>
            `;
            
            const stampEl = document.querySelector('.receipt-stamp');
            stampEl.textContent = fee.status.toUpperCase();
            stampEl.className = 'receipt-stamp';
            if (fee.status === 'Paid') {
                stampEl.style.color = 'var(--success)';
                stampEl.style.borderColor = 'var(--success)';
            } else if (fee.status === 'Partial') {
                stampEl.style.color = 'var(--warning)';
                stampEl.style.borderColor = 'var(--warning)';
            } else {
                stampEl.style.color = 'var(--danger)';
                stampEl.style.borderColor = 'var(--danger)';
            }
            
            document.getElementById('receiptModal').style.display = 'flex';
        };

        document.getElementById('addStudentBtn')?.addEventListener('click', function() {
            let newId = 'ST-2026-' + String(students.length + 201).slice(-3);
            let name = document.getElementById('sName').value;
            let phone = document.getElementById('sPhone').value;
            let course = document.getElementById('sCourse').value;
            let fee = parseFloat(document.getElementById('sFee').value) || 0;
            
            if (!name || !phone || !course) {
                alert('Please fill all required fields');
                return;
            }
            
            students.push({ id: newId, name, phone, course, monthlyFee: fee, admission: '2026-02-15', status: 'Active' });
            saveToLocalStorage();
            refreshUI();
            setTimeout(() => alert(`✅ Student added!\nID: ${newId}`), 300);
        });

        document.getElementById('payFeeBtn')?.addEventListener('click', function() {
            let sid = document.getElementById('feeStudent').value;
            if (!sid) return alert('Please select a student');
            let month = document.getElementById('feeMonth').value;
            let total = parseFloat(document.getElementById('feeTotal').value);
            let paying = parseFloat(document.getElementById('feePaidNow').value);
            if (isNaN(paying) || paying <= 0) return alert('Enter valid amount > 0');
            if (paying > total) return alert('Amount cannot exceed total fee');
            let method = document.getElementById('feeMethod').value;
            let remaining = total - paying;
            
            let status = remaining === 0 ? 'Paid' : (paying > 0 ? 'Partial' : 'Unpaid');
            
            let idx = fees.findIndex(f => f.studentId === sid && f.month === month);
            let rec = { studentId: sid, month, totalFee: total, paid: paying, remaining, status, paymentDate: new Date().toISOString().slice(0,10), method };
            
            if (idx >= 0) fees[idx] = rec;
            else fees.push(rec);
            
            saveToLocalStorage();
            refreshUI();
            showReceipt(sid, month);
            setTimeout(() => alert('✅ Payment recorded!'), 300);
        });

        document.getElementById('feeStudent')?.addEventListener('change', updateTotal);
        document.getElementById('studentSearch')?.addEventListener('input', refreshUI);
        document.getElementById('feeSearch')?.addEventListener('input', refreshUI);
        document.getElementById('feeMonthFilter')?.addEventListener('change', refreshUI);
        document.getElementById('feeStatusFilter')?.addEventListener('change', refreshUI);
        document.getElementById('dashboardMonth')?.addEventListener('change', refreshUI);
        
        document.getElementById('showUnpaidOnly')?.addEventListener('change', function() {
            const dropdown = document.getElementById('feeStudent');
            dropdown.style.transform = 'scale(0.98)';
            setTimeout(() => {
                dropdown.style.transform = 'scale(1)';
                updateFeeStudentDropdown();
            }, 150);
        });
        
        document.getElementById('feeMonth')?.addEventListener('change', function() {
            updateUnpaidCount();
            if (document.getElementById('showUnpaidOnly').checked) {
                updateFeeStudentDropdown();
            }
        });

        const tabs = document.querySelectorAll('.tab');
        const pages = {
            dashboard: document.getElementById('dashboard'),
            students: document.getElementById('students'),
            fees: document.getElementById('fees'),
            reports: document.getElementById('reports')
        };
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                let page = this.dataset.page;
                tabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                Object.values(pages).forEach(p => p.classList.remove('active-page'));
                pages[page].classList.add('active-page');
                if (page === 'fees') updateUnpaidCount();
            });
        });

        refreshUI();
        
        document.getElementById('unpaidToggleContainer')?.addEventListener('click', function(e) {
            if (e.target !== document.getElementById('showUnpaidOnly')) {
                const checkbox = document.getElementById('showUnpaidOnly');
                checkbox.checked = !checkbox.checked;
                checkbox.dispatchEvent(new Event('change'));
            }
        });
    })();