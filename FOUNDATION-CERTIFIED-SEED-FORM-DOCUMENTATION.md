# Foundation and Certified Seed Management Form Documentation

## Date: August 21, 2026

---

## Overview

The "Foundation and Certified Seed Management" form has been completely redesigned and enhanced with 30+ comprehensive fields covering seed classification, production details, quality parameters, certification, and storage information.

**Previous Name:** Add Seed Details  
**New Name:** Foundation and Certified Seed Management

---

## Form Sections and Fields

### Section 1: Seed Classification & Basic Information
| Field Name | Field Type | Required | Description |
|------------|------------|----------|-------------|
| Seed Class | Dropdown | Yes | Breeder, Foundation I, Foundation II, Certified |
| Season | Dropdown | Yes | Kharif 2024, Rabi 2024-25, Summer 2025, Kharif 2025 |
| Crop | Dropdown | Yes | 18 crop options (Wheat, Paddy, Maize, etc.) |
| Variety | Dropdown | Yes | 19 variety options (GW-322, JS-335, etc.) |
| Variety Code | Text | No | Auto-populated or manual entry |
| Seed Lot Number | Text | Yes | e.g., LOT-2024-W01 |
| Production Year | Number | Yes | e.g., 2024 (Year picker) |

### Section 2: Seed Producer Information
| Field Name | Field Type | Required | Description |
|------------|------------|----------|-------------|
| Seed Producer Name | Text | Yes | Full name of producer |
| Producer Registration No. | Text | Yes | e.g., PROD-MP-2024-001 |
| Production District | Dropdown | Yes | 9 district options |
| Production Block | Dropdown | Yes | 7 block options |

### Section 3: Production & Area Details
| Field Name | Field Type | Required | Description |
|------------|------------|----------|-------------|
| Area Under Seed Production (Hectare) | Number | Yes | Must be > 0 |
| Expected Production Quantity (Quintal) | Number | Yes | Estimated yield |
| Actual Production Quantity (Quintal) | Number | Yes | Actual harvested quantity |
| Processing Quantity (Quintal) | Number | No | Quantity sent for processing |

### Section 4: Quality & Approval Status
| Field Name | Field Type | Required | Description |
|------------|------------|----------|-------------|
| Approved Quantity (Quintal) | Number | Yes | Quantity approved for sale |
| Rejected Quantity (Quintal) | Number | No | Quantity rejected due to quality (default: 0) |
| Available Stock Quantity (Quintal) | Number | Yes | Current available stock |

### Section 5: Certification Details
| Field Name | Field Type | Required | Description |
|------------|------------|----------|-------------|
| Certification Agency | Dropdown | Yes | 5 certification agency options |
| Certification / Tag Number | Text | Yes | e.g., CERT-MP-2024-001 |
| Certification Date | Date | Yes | Date picker |

### Section 6: Quality Parameters
| Field Name | Field Type | Required | Validation | Description |
|------------|------------|----------|------------|-------------|
| Germination % | Number | Yes | 0-100 | e.g., 85.5 |
| Physical Purity % | Number | Yes | 0-100 | e.g., 98.0 |
| Moisture % | Number | Yes | 0-100 | e.g., 12.5 |

### Section 7: Storage & Packaging Details
| Field Name | Field Type | Required | Description |
|------------|------------|----------|-------------|
| Storage Warehouse | Dropdown | Yes | 5 warehouse options |
| Storage Location / Bin No. | Text | No | e.g., Rack A-3, Bin 15 |
| Bag Size (Kg) | Number | Yes | e.g., 40 |
| Number of Bags | Number | Yes | e.g., 250 |
| **Total Quantity (Kg)** | Auto-calculated | N/A | **Bag Size × Number of Bags** (displays in Kg and Quintal) |

### Section 8: Supporting Documents
| Field Name | Field Type | Required | Description |
|------------|------------|----------|-------------|
| Supporting Document | File Upload | No | Certification Certificate, Test Report (PDF, JPG, PNG up to 5MB) |

### Section 9: Remarks
| Field Name | Field Type | Required | Description |
|------------|------------|----------|-------------|
| Remarks | Textarea | No | Additional notes about seed production, quality, or special conditions |

---

## Dropdown Options

### Seed Class
- Breeder
- Foundation I
- Foundation II
- Certified

### Crops (18 options)
- Wheat
- Paddy (Rice)
- Maize
- Bajra (Pearl Millet)
- Jowar (Sorghum)
- Gram (Chickpea)
- Pigeon Pea (Arhar)
- Soybean
- Groundnut
- Mustard
- Sunflower
- Cotton
- Sugarcane
- Moong (Green Gram)
- Urad (Black Gram)
- Lentil (Masoor)
- Barley
- Oat

### Varieties (19 options)
- GW-322
- JS-335
- JG-315
- Pusa Bold
- MTU-7029
- IR-36
- DHM-117
- HHB-67
- CSH-16
- UPAS-120
- TAG-24
- KBSH-1
- Suraj (H-777)
- CO-86032
- K-851
- T-9
- L-4076
- RD-2035
- OS-6

### Districts (9 options)
- Bhopal
- Indore
- Jabalpur
- Gwalior
- Ujjain
- Chhindwara
- Seoni
- Narsinghpur
- Betul

### Blocks (7 options)
- Patan
- Harrai
- Amarwara
- Chaurai
- Mohgaon
- Sausar
- Tamia

### Certification Agencies (5 options)
- State Seed Certification Agency (SSCA)
- Madhya Pradesh State Seed Certification Agency
- Central Seed Certification Board
- ICAR Seed Certification
- Private Certification Agency

### Storage Warehouses (5 options)
- Central Warehouse, Bhopal
- Divisional Store, Jabalpur
- Regional Depot, Indore
- District Godown, Chhindwara
- Taluka Store, Patan

---

## Auto-Calculation Feature

### Total Quantity (Kg)
**Formula:** `Bag Size (Kg) × Number of Bags`

**Display Format:** `[Total] Kg ([Quintal] Quintal)`

**Example:**
- Bag Size: 40 Kg
- Number of Bags: 250
- **Result:** 10000.00 Kg (100.00 Quintal)

**Implementation:**
- Real-time calculation on input change
- Displayed in read-only field with green background
- Auto-updates when Bag Size or Number of Bags changes

---

## File Upload Specifications

### Supporting Document Upload
- **Allowed Types:** PDF, JPG, JPEG, PNG
- **Maximum Size:** 5MB
- **Purpose:** Certification certificates, test reports, quality analysis documents

### Upload Features:
1. Click-to-upload interface
2. File type validation
3. File size validation (max 5MB)
4. Success message with filename and size display
5. Visual feedback with icon

---

## Form Validation Rules

### Required Field Validations
1. **Seed Class** - Cannot be empty
2. **Season** - Must select from dropdown
3. **Crop** - Must select from dropdown
4. **Variety** - Must select from dropdown
5. **Seed Lot Number** - Cannot be empty
6. **Production Year** - Must be between 2000-2100
7. **Producer Name** - Cannot be empty
8. **Producer Registration No.** - Cannot be empty
9. **Production District** - Must select from dropdown
10. **Production Block** - Must select from dropdown
11. **Production Area** - Must be > 0
12. **Expected Quantity** - Must be > 0
13. **Actual Quantity** - Must be > 0
14. **Approved Quantity** - Must be ≥ 0
15. **Available Stock Quantity** - Must be ≥ 0
16. **Certification Agency** - Must select from dropdown
17. **Certification Number** - Cannot be empty
18. **Certification Date** - Must select valid date
19. **Germination %** - Must be 0-100
20. **Physical Purity %** - Must be 0-100
21. **Moisture %** - Must be 0-100
22. **Storage Warehouse** - Must select from dropdown
23. **Bag Size** - Must be > 0
24. **Number of Bags** - Must be > 0

### Custom Validations
- **File Upload:** Max 5MB, only PDF/JPG/PNG
- **Year:** Valid range 2000-2100
- **Percentages:** Must be between 0-100
- **Quantities:** Must be positive numbers

---

## Navigation & Page Titles

### Old Titles (Changed)
- Add Seed Details → **Foundation and Certified Seed Management**
- Add Seed Stock Details → **Foundation and Certified Seed Management**
- Edit Seed Stock Details → **Foundation and Certified Seed Management**

### Navigation Menu
**Sidebar Section:** Seed Stock  
**Menu Items:**
1. Foundation & Certified Seed (List View)
2. Foundation and Certified Seed Management (Add/Edit Form)

---

## Data Structure

### Saved Record Object
```javascript
{
  id: 'FC-1724256000000',
  seedClass: 'Foundation I',
  season: 'Rabi 2024-25',
  crop: 'Wheat',
  variety: 'GW-322',
  varietyCode: 'GW-322-F1',
  seedLotNo: 'LOT-2024-W01',
  productionYear: 2024,
  producerName: 'Ramesh Kumar Verma',
  producerRegNo: 'PROD-MP-2024-001',
  productionDistrict: 'Chhindwara',
  productionBlock: 'Patan',
  productionArea: 5.5,
  expectedQty: 120.0,
  actualQty: 118.5,
  processingQty: 115.0,
  approvedQty: 110.0,
  rejectedQty: 5.0,
  availableQty: 105.0,
  certAgency: 'State Seed Certification Agency (SSCA)',
  certNumber: 'CERT-MP-2024-001',
  certDate: '2024-07-15',
  germination: 88.5,
  physicalPurity: 99.0,
  moisture: 11.5,
  storageWarehouse: 'Central Warehouse, Bhopal',
  storageLocation: 'Rack A-3, Bin 15',
  bagSize: 40,
  numberOfBags: 250,
  totalQuantityKg: 10000,
  remarks: 'High quality seed batch',
  category: 'Foundation',
  qualityStatus: 'Passed',
  breederLotNo: 'LOT-2024-W01',
  producedQty: 118.5,
  processingDate: '2024-07-15',
  packagingQty: 40
}
```

---

## View Page Layout

### Three-Column Display
The view page displays all information in a 3-column layout:

**Column 1: Seed Classification**
- Stock ID
- Seed Class
- Season
- Crop
- Variety
- Variety Code
- Seed Lot Number
- Production Year

**Column 2: Production & Quality**
- Producer Name
- Producer Registration No.
- Production District
- Production Block
- Production Area
- Expected Quantity
- Actual Quantity
- Processing Quantity

**Column 3: Certification & Stock**
- Approved Quantity (highlighted green)
- Rejected Quantity (highlighted red)
- Available Quantity (highlighted green, bold)
- Certification Agency
- Certification Number
- Certification Date
- Quality Status badge

### Additional Details (2-column below main section)
**Quality Parameters:**
- Germination %
- Physical Purity %
- Moisture %

**Storage & Packaging:**
- Storage Warehouse
- Storage Location
- Bag Size
- Number of Bags
- Total Quantity (Kg and Quintal)

**Remarks:** (Full width if present)

---

## Form Actions

### Three Action Buttons
1. **Cancel** - Returns to list view without saving
2. **Save Draft** - Saves with draft status (future feature)
3. **Submit Record** - Validates and saves the complete record

### Success Messages
- **Add Mode:** "Record added successfully!"
- **Edit Mode:** "Record updated successfully!"

---

## Technical Implementation

### Files Modified
- **seed-modules.js** - Main form implementation

### New Functions Added
1. `App.smRenderFCForm(mode)` - Renders the complete form
2. `App.smCalculateTotalKg()` - Auto-calculates total quantity
3. `App.smHandleFileUpload(input)` - Handles file upload validation
4. `App.smFCSave(mode, submitType)` - Saves/updates record with validation
5. `App.smRenderFCView()` - Enhanced view page with all fields

### Event Listeners
- Bag Size input → triggers calculation
- Number of Bags input → triggers calculation
- File upload → validates and displays filename

---

## Usage Guide

### Adding a New Record
1. Click "Foundation and Certified Seed Management" from sidebar
2. Fill all required fields (marked with *)
3. Upload supporting documents if available
4. Review auto-calculated total quantity
5. Click "Submit Record"

### Editing an Existing Record
1. Go to Foundation & Certified Seed list
2. Click Edit button on desired record
3. Update fields as needed
4. Click "Update Record"

### Viewing Record Details
1. Go to Foundation & Certified Seed list
2. Click View button on desired record
3. Review all information in organized layout
4. Use Print button to print details

---

## Future Enhancements

### Planned Features
1. **Draft Save** - Save incomplete forms as drafts
2. **Bulk Upload** - Upload multiple records via Excel
3. **Print Templates** - Professional print layouts
4. **Export** - Export to PDF/Excel
5. **Document Gallery** - View uploaded certification documents
6. **Quality Alerts** - Warnings for low germination/purity
7. **Stock Alerts** - Notifications for low available quantity
8. **Approval Workflow** - Multi-level approval process
9. **Historical Tracking** - Track changes over time
10. **Reports** - Generate production and quality reports

---

## Testing Checklist

- [ ] All required fields show validation errors when empty
- [ ] Percentage fields validate 0-100 range
- [ ] Production year validates proper range
- [ ] Total quantity auto-calculates correctly
- [ ] File upload validates size and type
- [ ] File upload shows success message
- [ ] Form saves successfully in Add mode
- [ ] Form updates successfully in Edit mode
- [ ] View page displays all fields correctly
- [ ] Navigation between pages works
- [ ] Cancel button returns to list
- [ ] All dropdown options display correctly
- [ ] Date pickers work properly
- [ ] Number inputs accept decimals where appropriate

---

**Status:** ✅ Complete and Ready for Testing

**Total Fields:** 30+ comprehensive fields  
**Total Sections:** 9 organized sections  
**Total Dropdowns:** 7 with pre-populated options  
**Auto-calculations:** 1 (Total Quantity in Kg)  
**File Upload:** 1 (Supporting Documents)  
**Validation Rules:** 24+ comprehensive validations
