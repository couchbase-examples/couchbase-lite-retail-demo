package com.couchbase.grocery.models;

import com.couchbase.lite.Document;
import com.couchbase.lite.MutableDocument;

/**
 * Replenishment order. Schema matches the seeded Capella docs and the
 * Android port — note there is no {@code itemName} field; the UI shows
 * {@code Order #{orderId}} and (optionally) joins on {@code productId} to
 * resolve the human-readable name.
 */
public class Order {
    public enum Status {
        SUBMITTED("Submitted"),
        IN_REVIEW("In Review"),
        APPROVED("Approved"),
        REJECTED("Rejected");

        public final String label;
        Status(String label) { this.label = label; }

        public static Status fromLabel(String s) {
            if (s == null) return SUBMITTED;
            for (Status v : values()) if (v.label.equalsIgnoreCase(s)) return v;
            return SUBMITTED;
        }
    }

    private String id;
    private int orderId;            // monotonically increasing per store
    private String storeId;
    private long orderDate;         // epoch millis
    private Status orderStatus = Status.SUBMITTED;
    private Integer productId;
    private String sku;
    private String unit;
    private int orderQty;

    public Order() {}

    public static Order fromDocument(Document doc) {
        Order o = new Order();
        o.id          = doc.getId();
        o.orderId     = (int) doc.getLong("orderId");
        o.storeId     = doc.getString("storeId");
        o.orderDate   = doc.getLong("orderDate");
        o.orderStatus = Status.fromLabel(doc.getString("orderStatus"));
        o.productId   = doc.contains("productId") ? (int) doc.getLong("productId") : null;
        o.sku         = doc.getString("sku");
        o.unit        = doc.getString("unit");
        o.orderQty    = (int) doc.getLong("orderQty");
        return o;
    }

    public MutableDocument toMutable() {
        MutableDocument doc = id != null ? new MutableDocument(id) : new MutableDocument();
        doc.setString("docType", "Order")
           .setLong("orderId", orderId)
           .setString("storeId", storeId != null ? storeId : "")
           .setLong("orderDate", orderDate)
           .setString("orderStatus", orderStatus.label)
           .setLong("orderQty", orderQty);
        if (productId != null) doc.setLong("productId", productId);
        if (sku != null)       doc.setString("sku", sku);
        if (unit != null)      doc.setString("unit", unit);
        return doc;
    }

    public String getId()        { return id; }
    public void setId(String id) { this.id = id; }
    public int getOrderId()      { return orderId; }
    public void setOrderId(int o){ this.orderId = o; }
    public String getStoreId()   { return storeId; }
    public void setStoreId(String s) { this.storeId = s; }
    public long getOrderDate()   { return orderDate; }
    public void setOrderDate(long d) { this.orderDate = d; }
    public Status getOrderStatus(){ return orderStatus; }
    public void setOrderStatus(Status s) { this.orderStatus = s; }
    public Integer getProductId(){ return productId; }
    public void setProductId(Integer p) { this.productId = p; }
    public String getSku()       { return sku; }
    public void setSku(String s) { this.sku = s; }
    public String getUnit()      { return unit; }
    public void setUnit(String u){ this.unit = u; }
    public int getOrderQty()     { return orderQty; }
    public void setOrderQty(int q) { this.orderQty = q; }
}
