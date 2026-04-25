# 🧪 Test Dialog Components

## Quick Test - Copy paste ini ke AdminDashboard untuk test dialogs

### Step 1: Add State di AdminDashboard component (setelah line `const [activeTab, setActiveTab] = useState('overview');`)

```tsx
// Dialog States
const [assignDialog, setAssignDialog] = useState(false);
const [selectedJob, setSelectedJob] = useState(null);

const [inventoryDialog, setInventoryDialog] = useState(false);
const [editInventoryItem, setEditInventoryItem] = useState(null);
const [inventoryMode, setInventoryMode] = useState('create');

const [techDialog, setTechDialog] = useState(false);
const [editTechnician, setEditTechnician] = useState(null);
const [techMode, setTechMode] = useState('create');

const [settingsDialog, setSettingsDialog] = useState(false);
const [jobDetailDialog, setJobDetailDialog] = useState(false);

// CRUD Handlers
const handleAssignTechnician = (jobId: string, techId: string, notes: string) => {
  const job = mockJobs.find(j => j.id === jobId);
  const tech = mockTechnicians.find(t => t.id === techId);
  
  if (job && tech) {
    // Update job dengan assigned technician
    job.technician = tech.name;
    job.status = 'scheduled';
    toast.success(`✅ ${tech.name} ditugaskan untuk ${job.jobNumber}!`);
  }
};

const handleSaveInventory = (item: any) => {
  if (inventoryMode === 'create') {
    const newItem = {
      ...item,
      id: `${mockInventory.length + 1}`,
      lowStock: item.stock <= item.minStock
    };
    mockInventory.push(newItem);
    toast.success('✅ Item baru berhasil ditambahkan!');
  } else {
    const index = mockInventory.findIndex(i => i.id === item.id);
    if (index !== -1) {
      mockInventory[index] = { ...item, lowStock: item.stock <= item.minStock };
      toast.success('✅ Item berhasil diupdate!');
    }
  }
};

const handleSaveTechnician = (tech: any) => {
  if (techMode === 'create') {
    const newTech = {
      ...tech,
      id: `${mockTechnicians.length + 1}`,
      activeJobs: 0,
      completedJobs: 0,
      rating: 5.0
    };
    mockTechnicians.push(newTech);
    toast.success('✅ Teknisi baru berhasil ditambahkan!');
  } else {
    const index = mockTechnicians.findIndex(t => t.id === tech.id);
    if (index !== -1) {
      mockTechnicians[index] = tech;
      toast.success('✅ Data teknisi berhasil diupdate!');
    }
  }
};
```

### Step 2: Update "Pengaturan" button (di header section)

Replace:
```tsx
<Button variant="ghost" size="sm">
  <Settings className="w-4 h-4 mr-2" />
  Pengaturan
</Button>
```

With:
```tsx
<Button 
  variant="ghost" 
  size="sm"
  onClick={() => setSettingsDialog(true)}
>
  <Settings className="w-4 h-4 mr-2" />
  Pengaturan
</Button>
```

### Step 3: Update "Assign Teknisi" button di pending jobs section

Replace:
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

With:
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

### Step 4: Update "Tambah Item" button di Inventory tab

Replace:
```tsx
<Button className="bg-green-500 hover:bg-green-600 text-white">
  <Plus className="w-4 h-4 mr-2" />
  Tambah Item
</Button>
```

With:
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

### Step 5: Update Edit button di Inventory table

Replace:
```tsx
<Button variant="ghost" size="sm">
  <Edit className="w-4 h-4" />
</Button>
```

With:
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

### Step 6: Update "Tambah Teknisi" button

Replace:
```tsx
<Button className="bg-green-500 hover:bg-green-600 text-white">
  <Plus className="w-4 h-4 mr-2" />
  Tambah Teknisi
</Button>
```

With:
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

### Step 7: Update Edit button di Technicians card

Replace:
```tsx
<Button variant="outline" size="sm" className="flex-1">
  <Edit className="w-4 h-4 mr-2" />
  Edit
</Button>
```

With:
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

### Step 8: Add Dialog Components (sebelum closing </div> di akhir component)

```tsx
      {/* Dialog Components */}
      <AssignTechnicianDialog
        open={assignDialog}
        onOpenChange={setAssignDialog}
        job={selectedJob}
        technicians={mockTechnicians}
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
    </div>
  );
}
```

---

## 🎯 Testing Checklist

**Job Orders:**
- [ ] Click "Assign Teknisi" pada pending job → Dialog muncul
- [ ] Select teknisi → Info teknisi muncul
- [ ] Add notes (optional)
- [ ] Click "Assign Teknisi" → Success toast
- [ ] Dialog close, job updated

**Inventory:**
- [ ] Click "Tambah Item" → Dialog mode create
- [ ] Fill form → Validation works
- [ ] Save → Item added, success toast
- [ ] Click Edit icon → Dialog mode edit
- [ ] Update data → Save → Item updated

**Technicians:**
- [ ] Click "Tambah Teknisi" → Dialog create
- [ ] Fill form → Phone/email validation
- [ ] Save → Teknisi added
- [ ] Click Edit → Dialog edit
- [ ] Update → Save works

**Settings:**
- [ ] Click "Pengaturan" button → Dialog opens
- [ ] Tab "Akun Saya" → Update profile works
- [ ] Change password → Validation works
- [ ] Tab "User Management" → Users displayed
- [ ] Edit/Delete buttons work

---

## 🚀 Result

Semua CRUD operations akan fully functional dengan dialog-based interface yang professional! 🎉
