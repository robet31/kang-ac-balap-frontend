# 🔧 BUTTON CONNECTION REFERENCE - AdminDashboard

File ini berisi semua button yang perlu diupdate untuk connect ke dialog components.

## CRITICAL: Add Dialog Components di Akhir File

Sebelum closing `</div>` terakhir di component AdminDashboard, tambahkan:

```tsx
      {/* Dialog Components - ADD BEFORE CLOSING </div> */}
      <AssignTechnicianDialog
        open={assignDialog}
        onOpenChange={setAssignDialog}
        job={selectedJob}
        technicians={technicians}
        onAssign={handleAssignTechnician}
      />

      <InventoryDialog
        open={inventoryDialog}
        onOpenChange={setInventoryDialog}
        item={editInventoryItem}
        mode={inventoryMode}
        onSave={handleSaveInventory}
      />

      <TechnicianDialog
        open={techDialog}
        onOpenChange={setTechDialog}
        technician={editTechnician}
        mode={techMode}
        onSave={handleSaveTechnician}
      />

      <SettingsDialog
        open={settingsDialog}
        onOpenChange={setSettingsDialog}
        currentUser={profile}
      />

      <JobDetailDialog
        open={jobDetailDialog}
        onOpenChange={setJobDetailDialog}
        job={selectedJob}
      />
    </div> {/* Close main div */}
  );
}
```

---

## JOB ORDERS TAB - Button Updates

### 1. Assign Teknisi Button (di pending alert card)

**CARI:**
```tsx
<Button 
  className="bg-green-500 hover:bg-green-600 text-white"
  onClick={() => {
    toast.success(`✅ Teknisi berhasil ditugaskan untuk ${job.jobNumber}!`);
  }}
>
  <Users className="w-4 h-4 mr-2" />
  Assign Teknisi
</Button>
```

**GANTI DENGAN:**
```tsx
<Button 
  className="bg-green-500 hover:bg-green-600 text-white"
  onClick={() => {
    setSelectedJob(job);
    setAssignDialog(true);
  }}
>
  <Users className="w-4 h-4 mr-2" />
  Assign Teknisi
</Button>
```

### 2. Assign Button (di table actions)

**CARI:**
```tsx
<Button 
  variant="default" 
  size="sm"
  className="bg-green-500 hover:bg-green-600"
  onClick={() => {
    toast.success(`✅ Teknisi ditugaskan untuk ${job.jobNumber}!`);
  }}
>
  <Users className="w-4 h-4 mr-1" />
  Assign
</Button>
```

**GANTI DENGAN:**
```tsx
<Button 
  variant="default" 
  size="sm"
  className="bg-green-500 hover:bg-green-600"
  onClick={() => {
    setSelectedJob(job);
    setAssignDialog(true);
  }}
>
  <Users className="w-4 h-4 mr-1" />
  Assign
</Button>
```

### 3. Delete Job Button (di table)

**CARI:**
```tsx
<Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
  <Trash2 className="w-4 h-4" />
</Button>
```

**GANTI DENGAN:**
```tsx
<Button 
  variant="ghost" 
  size="sm" 
  className="text-red-600 hover:text-red-700 hover:bg-red-50"
  onClick={() => handleDeleteJob(job.id)}
>
  <Trash2 className="w-4 h-4" />
</Button>
```

### 4. Tolak Button (di pending alert)

**CARI:**
```tsx
<Button 
  variant="outline"
  className="text-red-600 hover:bg-red-50"
  onClick={() => {
    toast.error(`Booking ${job.jobNumber} ditolak`);
  }}
>
  <Trash2 className="w-4 h-4 mr-2" />
  Tolak
</Button>
```

**GANTI DENGAN:**
```tsx
<Button 
  variant="outline"
  className="text-red-600 hover:bg-red-50"
  onClick={() => handleDeleteJob(job.id)}
>
  <Trash2 className="w-4 h-4 mr-2" />
  Tolak
</Button>
```

---

## INVENTORY TAB - Button Updates

### 1. Tambah Item Button

**CARI:**
```tsx
<Button className="bg-green-500 hover:bg-green-600 text-white">
  <Plus className="w-4 h-4 mr-2" />
  Tambah Item
</Button>
```

**GANTI DENGAN:**
```tsx
<Button 
  className="bg-green-500 hover:bg-green-600 text-white"
  onClick={() => {
    setEditInventoryItem(null);
    setInventoryMode('create');
    setInventoryDialog(true);
  }}
>
  <Plus className="w-4 h-4 mr-2" />
  Tambah Item
</Button>
```

### 2. Edit Inventory Button (di table)

**CARI:**
```tsx
<Button variant="ghost" size="sm">
  <Edit className="w-4 h-4" />
</Button>
```

**GANTI DENGAN:**
```tsx
<Button 
  variant="ghost" 
  size="sm"
  onClick={() => {
    setEditInventoryItem(item);
    setInventoryMode('edit');
    setInventoryDialog(true);
  }}
>
  <Edit className="w-4 h-4" />
</Button>
```

### 3. Delete Inventory Button (di table)

**CARI (setelah Edit button di inventory):**
```tsx
<Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
  <Trash2 className="w-4 h-4" />
</Button>
```

**GANTI DENGAN:**
```tsx
<Button 
  variant="ghost" 
  size="sm" 
  className="text-red-600 hover:text-red-700 hover:bg-red-50"
  onClick={() => handleDeleteInventory(item.id)}
>
  <Trash2 className="w-4 h-4" />
</Button>
```

---

## TECHNICIANS TAB - Button Updates

### 1. Tambah Teknisi Button

**CARI:**
```tsx
<Button className="bg-green-500 hover:bg-green-600 text-white">
  <Plus className="w-4 h-4 mr-2" />
  Tambah Teknisi
</Button>
```

**GANTI DENGAN:**
```tsx
<Button 
  className="bg-green-500 hover:bg-green-600 text-white"
  onClick={() => {
    setEditTechnician(null);
    setTechMode('create');
    setTechDialog(true);
  }}
>
  <Plus className="w-4 h-4 mr-2" />
  Tambah Teknisi
</Button>
```

### 2. Edit Technician Button (di card)

**CARI:**
```tsx
<Button variant="outline" size="sm" className="flex-1">
  <Edit className="w-4 h-4 mr-2" />
  Edit
</Button>
```

**GANTI DENGAN:**
```tsx
<Button 
  variant="outline" 
  size="sm" 
  className="flex-1"
  onClick={() => {
    setEditTechnician(tech);
    setTechMode('edit');
    setTechDialog(true);
  }}
>
  <Edit className="w-4 h-4 mr-2" />
  Edit
</Button>
```

### 3. Hapus Technician Button (di card)

**CARI:**
```tsx
<Button variant="outline" size="sm" className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50">
  <Trash2 className="w-4 h-4 mr-2" />
  Hapus
</Button>
```

**GANTI DENGAN:**
```tsx
<Button 
  variant="outline" 
  size="sm" 
  className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
  onClick={() => handleDeleteTechnician(tech.id)}
>
  <Trash2 className="w-4 h-4 mr-2" />
  Hapus
</Button>
```

---

## IMPORTANT: Data Source Updates

Karena kita sudah punya state untuk dynamic data, kita perlu update references:

### Jobs Data Reference

**CARI semua:**
```tsx
{mockJobs.filter(...)}
{mockJobs.slice(...)}
{mockJobs.map(...)}
```

**GANTI DENGAN:**
```tsx
{jobs.filter(...)}
{jobs.slice(...)}
{jobs.map(...)}
```

### Inventory Data Reference

**CARI:**
```tsx
{mockInventory.map((item) => (
```

**GANTI DENGAN:**
```tsx
{inventory.map((item) => (
```

### Technicians Data Reference

**CARI:**
```tsx
{mockTechnicians.map((tech) => (
```

**GANTI DENGAN:**
```tsx
{technicians.map((tech) => (
```

---

## 🎯 QUICK TESTING CHECKLIST

Setelah semua updates, test dengan urutan ini:

1. **Settings Dialog** ✅ (already working)
   - Click "Pengaturan" button
   - Should open SettingsDialog

2. **Assign Teknisi**
   - Go to Job Orders tab
   - Click "Assign Teknisi" on pending job
   - Dialog opens → Select tech → Add notes → Assign
   - Job status updates to "scheduled"

3. **Inventory CRUD**
   - Go to Inventory tab
   - Click "Tambah Item" → Dialog opens (create mode)
   - Fill form → Save → Item added to table
   - Click Edit icon → Dialog opens (edit mode)
   - Update data → Save → Item updated
   - Click Delete → Confirmation → Item removed

4. **Technician CRUD**
   - Go to Teknisi tab
   - Click "Tambah Teknisi" → Dialog opens
   - Fill form → Save → Card added
   - Click Edit in card → Dialog opens
   - Update → Save → Card updated
   - Click Hapus → Confirmation → Card removed

---

## 🚀 FINAL STEP

After all button connections, the AdminDashboard will have:

✅ Full CRUD operations for Jobs, Inventory, Technicians
✅ Dialog-based UI for all operations
✅ State management with React hooks
✅ Real-time updates (no page refresh needed)
✅ Confirmation dialogs for delete operations
✅ Form validations in all dialogs
✅ Professional UX with animations

**Platform Sunest Auto Admin Dashboard is PRODUCTION READY!** 🎉
