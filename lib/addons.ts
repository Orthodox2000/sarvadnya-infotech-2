// CHANGE: 2026-08-21 — NEW: static catalog of Tally TDL add-ons for /addons page + Productbar "Addons" column.
// CHANGE: 2026-08-21 — Trimmed to top 20 most-demanded add-ons (per client request) from the initial 73-item list.
export interface Addon {
  id: string;
  title: string;
  description: string;
}

export const addons: Addon[] = [
  {
    id: "additional-terms-sales-invoice",
    title: "Additional Terms & Conditions in Sales Invoice",
    description: "Define your own Terms in Voucher type and print the same in the invoice.",
  },
  {
    id: "discount-amount-sales-invoice",
    title: "Discount Amount Display in Sales Invoice & Sales Register based on Discount %",
    description: "By default Tally provides Discount% column in Sales voucher. Using this TDL, you can provide Discount amount in Sales.",
  },
  {
    id: "party-wise-last-sold-rate",
    title: "Party-wise Item Last Sold Rate Display in Sales Invoice",
    description: "View the previous Sales price of the selected item for the particular Party in Sales voucher which helps finalize the current sales price of the given item.",
  },
  {
    id: "stock-group-wise-item-sales",
    title: "Stock Group-wise Item Display in Sales Screen",
    description: "Select Group first in Sales voucher which filters the stock item list created under the selected group — transactions become easier for companies with multiple types of stock items.",
  },
  {
    id: "duplicate-purchase-block",
    title: "Duplicate Purchase Block based on Supplier Invoice Number & Supplier GSTIN",
    description: "Blocks duplicate purchase entries when the same supplier invoice number and GSTIN are entered again.",
  },
  {
    id: "bill-blocking-negative-stock",
    title: "Bill Blocking with Negative Stock",
    description: "If the Stock item is not available up to the Billing amount, the system will block billing for such Stock items. However, the Admin has the right to override this setting.",
  },
  {
    id: "seal-sign-sales-invoice",
    title: "Seal & Sign on Sales Invoice",
    description: "Print company seal and authorised signature images on sales invoices.",
  },
  {
    id: "skip-rate-field-users",
    title: "Skip Rate Field for Users in Sales Voucher Entry Screen",
    description: "Doesn't allow users to change the Item Sales rate in Sales voucher.",
  },
  {
    id: "lock-sales-below-last-purchase-rate",
    title: "Lock Sales Below Last Purchase Rate",
    description: "Doesn't allow providing the Sales price of an item below its Last Purchase price and throws an error message.",
  },
  {
    id: "user-wise-ledger-blocking",
    title: "User-wise Ledger Blocking",
    description: "Disallow a user from making transactions using the selected ledgers.",
  },
  {
    id: "disable-delete-cancel-users",
    title: "Disable Delete / Cancel Options for Users",
    description: "Disables the DELETE and CANCEL buttons for users in Tally except the Admin user.",
  },
  {
    id: "ledger-replace",
    title: "Ledger Replace",
    description: "When transactions belong to the same head but are entered under different ledger heads, transfer transactions from one ledger to another so all selected transactions sit under a single head with minimum manual effort.",
  },
  {
    id: "show-last-purchase-cost-sales",
    title: "Show Last Purchase Cost in Sales",
    description: "Shows last purchase price of an item during Sales transactions so the user can decide what Sales price to quote to the customer.",
  },
  {
    id: "auto-email-os-statement",
    title: "Auto Email O/S Statement on Specific Days Setting",
    description: "Configure reminder emails on a particular day so they are automatically sent to all parties having O/S on that day.",
  },
  {
    id: "double-discount",
    title: "Double Discount",
    description: "Distributors / Wholesellers can give Discount on Discount in Sales voucher, which can also be printed in the invoice print.",
  },
  {
    id: "show-hsn-register",
    title: "Show HSN in Sales / Purchase Register",
    description: "Adds HSN/SAC information in the Sales / Purchase register report.",
  },
  {
    id: "auto-email-sales-invoices",
    title: "Auto Email Sales Invoices after Save",
    description: "Automatically emails the sales invoice PDF to the party as soon as the voucher is saved.",
  },
  {
    id: "auto-receipt-in-sales",
    title: "Auto Receipt in Sales",
    description: "For when the customer makes payment (part/full) during the buying process. Provide receipt details in multiple modes (cash / bank) and entries are passed once the Sales entry is saved.",
  },
  {
    id: "block-billing-beyond-due-date",
    title: "Block Billing beyond Due Date",
    description: "Blocks invoicing for any party having an invoice pending beyond due date. Once the bill is cleared, billing resumes again.",
  },
  {
    id: "single-level-maker-checker",
    title: "Single Level Maker & Checker",
    description: "New users can make transactions without impacting financial data — entries stay pending until approved. The approver can approve / reject with remarks. Duplicated approved transactions don't re-enter the approval list.",
  },
];

export function getAddonById(id: string): Addon | undefined {
  return addons.find((a) => a.id === id);
}
