// CHANGE: 2026-10-22 — MOVED the add-ons catalogue from lib/addons.ts into this pure-ESM
// module so there is ONE source of truth for the 20 TDL add-ons.
//
// WHY: the owner asked Sara to "add our add-ons, products and details when suggesting and
// advising". The chat route (server), the offline fallback (lib/sara-topics.ts) and the plain
// Node test suites all need the catalogue. Keeping it in a .ts file meant every consumer had to
// duplicate it (drift). This is the same pattern as lib/prices-catalog.mjs + lib/prices.ts and
// lib/email-autoreply.mjs + lib/email-autoreply.d.mts.
//
// lib/addons.ts is now a thin TYPED FACADE over this file, so the existing app imports
// (`import { addons, type Addon } from '@/lib/addons'`) keep working unchanged.
//
// NEW FIELDS (Sara-facing, never shown as-is on the page):
//   useCase  — one line saying WHEN to suggest this add-on (the "detail" the owner asked for).
//   keywords — matching terms so a business problem can be matched to the right add-on.
// The /addons page renders only title + description, so nothing visible changed.

export const addons = [
  {
    id: "additional-terms-sales-invoice",
    title: "Additional Terms & Conditions in Sales Invoice",
    description: "Define your own Terms in Voucher type and print the same in the invoice.",
    useCase: "For businesses that need their own Terms & Conditions printed on every Sales invoice.",
    keywords: ["terms", "terms and conditions", "t&c", "invoice terms", "conditions on invoice", "print terms"],
  },
  {
    id: "discount-amount-sales-invoice",
    title: "Discount Amount Display in Sales Invoice & Sales Register based on Discount %",
    description: "By default Tally provides Discount% column in Sales voucher. Using this TDL, you can provide Discount amount in Sales.",
    useCase: "Show the discount AMOUNT (not just the percentage) on Sales invoices and the Sales Register.",
    keywords: ["discount amount", "discount value", "discount amount in sales", "sales register discount"],
  },
  {
    id: "party-wise-last-sold-rate",
    title: "Party-wise Item Last Sold Rate Display in Sales Invoice",
    description: "View the previous Sales price of the selected item for the particular Party in Sales voucher which helps finalize the current sales price of the given item.",
    useCase: "See what you last sold that item to that customer, before you quote a new rate.",
    keywords: ["last sold rate", "party wise rate", "previous selling price", "last sale price", "old rate for customer"],
  },
  {
    id: "stock-group-wise-item-sales",
    title: "Stock Group-wise Item Display in Sales Screen",
    description: "Select Group first in Sales voucher which filters the stock item list created under the selected group — transactions become easier for companies with multiple types of stock items.",
    useCase: "Filter the item list by stock group in the Sales voucher — faster billing for multi-group businesses.",
    keywords: ["stock group filter", "group wise item", "filter items by group", "stock group wise"],
  },
  {
    id: "duplicate-purchase-block",
    title: "Duplicate Purchase Block based on Supplier Invoice Number & Supplier GSTIN",
    description: "Blocks duplicate purchase entries when the same supplier invoice number and GSTIN are entered again.",
    useCase: "Stop the same supplier invoice number + GSTIN being entered twice.",
    keywords: ["duplicate purchase", "duplicate invoice", "duplicate bill", "duplicate entry", "supplier invoice number"],
  },
  {
    id: "bill-blocking-negative-stock",
    title: "Bill Blocking with Negative Stock",
    description: "If the Stock item is not available up to the Billing amount, the system will block billing for such Stock items. However, the Admin has the right to override this setting.",
    useCase: "Block billing an item that is not in stock (the Admin can still override).",
    keywords: ["negative stock", "block billing", "bill blocking", "stock not available", "billing without stock", "oversell"],
  },
  {
    id: "seal-sign-sales-invoice",
    title: "Seal & Sign on Sales Invoice",
    description: "Print company seal and authorised signature images on sales invoices.",
    useCase: "Print your company seal and authorised signature on Sales invoices.",
    keywords: ["seal", "signature", "sign on invoice", "logo on invoice", "company stamp"],
  },
  {
    id: "skip-rate-field-users",
    title: "Skip Rate Field for Users in Sales Voucher Entry Screen",
    description: "Doesn't allow users to change the Item Sales rate in Sales voucher.",
    useCase: "Stop counter staff changing the Sales rate — price control for the front desk.",
    keywords: ["skip rate", "rate field", "lock rate", "cannot change rate", "price control", "hide rate"],
  },
  {
    id: "lock-sales-below-last-purchase-rate",
    title: "Lock Sales Below Last Purchase Rate",
    description: "Doesn't allow providing the Sales price of an item below its Last Purchase price and throws an error message.",
    useCase: "Stop anyone selling below the last purchase rate — kills margin leakage.",
    keywords: ["below purchase rate", "lock sales rate", "margin", "purchase price", "minimum price", "rate control"],
  },
  {
    id: "user-wise-ledger-blocking",
    title: "User-wise Ledger Blocking",
    description: "Disallow a user from making transactions using the selected ledgers.",
    useCase: "Stop a particular user from posting entries in selected ledgers.",
    keywords: ["user wise ledger", "ledger blocking", "restrict user", "user access control", "block ledger"],
  },
  {
    id: "disable-delete-cancel-users",
    title: "Disable Delete / Cancel Options for Users",
    description: "Disables the DELETE and CANCEL buttons for users in Tally except the Admin user.",
    useCase: "Hide DELETE and CANCEL for every user except the Admin.",
    keywords: ["delete cancel", "disable delete", "cannot delete voucher", "cancel option", "restrict deletion", "voucher deletion"],
  },
  {
    id: "ledger-replace",
    title: "Ledger Replace",
    description: "When transactions belong to the same head but are entered under different ledger heads, transfer transactions from one ledger to another so all selected transactions sit under a single head with minimum manual effort.",
    useCase: "Move entries booked under a wrong ledger head into the right one, in bulk.",
    keywords: ["ledger replace", "change ledger", "wrong ledger", "merge ledger", "transfer entries", "reclassify"],
  },
  {
    id: "show-last-purchase-cost-sales",
    title: "Show Last Purchase Cost in Sales",
    description: "Shows last purchase price of an item during Sales transactions so the user can decide what Sales price to quote to the customer.",
    useCase: "Show the last purchase cost inside the Sales voucher so the team prices with the real margin in view.",
    keywords: ["last purchase cost", "purchase cost in sales", "cost price", "margin in sales", "show cost"],
  },
  {
    id: "auto-email-os-statement",
    title: "Auto Email O/S Statement on Specific Days Setting",
    description: "Configure reminder emails on a particular day so they are automatically sent to all parties having O/S on that day.",
    useCase: "Auto-email the outstanding (O/S) statement to customers on a chosen day every month.",
    keywords: ["outstanding statement", "os statement", "auto email statement", "reminder email", "receivable reminder", "dunning"],
  },
  {
    id: "double-discount",
    title: "Double Discount",
    description: "Distributors / Wholesalers can give Discount on Discount in Sales voucher, which can also be printed in the invoice print.",
    useCase: "Discount on discount for distributors and wholesalers, and it prints on the invoice.",
    keywords: ["double discount", "discount on discount", "two discounts", "wholesaler discount", "nested discount"],
  },
  {
    id: "show-hsn-register",
    title: "Show HSN in Sales / Purchase Register",
    description: "Adds HSN/SAC information in the Sales / Purchase register report.",
    useCase: "Add the HSN / SAC columns to the Sales and Purchase registers.",
    keywords: ["hsn", "sac", "hsn in register", "sac code", "hsn column"],
  },
  {
    id: "auto-email-sales-invoices",
    title: "Auto Email Sales Invoices after Save",
    description: "Automatically emails the sales invoice PDF to the party as soon as the voucher is saved.",
    useCase: "Email the Sales invoice PDF to the customer the moment the voucher is saved.",
    keywords: ["auto email invoice", "send invoice by email", "email invoice", "invoice pdf email", "automatically email invoice"],
  },
  {
    id: "auto-receipt-in-sales",
    title: "Auto Receipt in Sales",
    description: "For when the customer makes payment (part/full) during the buying process. Provide receipt details in multiple modes (cash / bank) and entries are passed once the Sales entry is saved.",
    useCase: "Capture the customer's part or full payment at the time of billing, and post the receipt automatically.",
    keywords: ["auto receipt", "payment during sales", "advance payment", "receipt in sales", "bill and collect", "payment at billing"],
  },
  {
    id: "block-billing-beyond-due-date",
    title: "Block Billing beyond Due Date",
    description: "Blocks invoicing for any party having an invoice pending beyond due date. Once the bill is cleared, billing resumes again.",
    useCase: "Stop invoicing a customer whose bills are past the due date — billing resumes once they clear it.",
    keywords: ["due date", "block billing beyond due date", "overdue", "stop billing", "credit control", "pending payment", "not paid"],
  },
  {
    id: "single-level-maker-checker",
    title: "Single Level Maker & Checker",
    description: "New users can make transactions without impacting financial data — entries stay pending until approved. The approver can approve / reject with remarks. Duplicated approved transactions don't re-enter the approval list.",
    useCase: "Two-level control: the maker enters, the checker approves before it touches the books.",
    keywords: ["maker checker", "approval", "approve voucher", "two level", "authorisation", "pending approval", "review before posting"],
  },
];

export function getAddonById(id) {
  return addons.find((a) => a.id === id);
}
