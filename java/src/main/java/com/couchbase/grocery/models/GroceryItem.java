package com.couchbase.grocery.models;

import com.couchbase.lite.Document;
import com.couchbase.lite.MutableDocument;

/**
 * Inventory item. Field names match the seeded Capella documents 1:1 — see
 * the Android port's {@code GroceryItem.kt} which uses the same schema.
 */
public class GroceryItem {
    private String id;
    private String name;
    private String type;
    private double price;
    private String imageURL;      // capital URL — matches the doc key
    private int quantity;
    private Integer productId;
    private String sku;
    private String unit;

    public GroceryItem() {}

    public static GroceryItem fromDocument(Document doc) {
        GroceryItem item = new GroceryItem();
        item.id        = doc.getId();
        item.name      = doc.getString("name");
        item.type      = doc.getString("type");
        item.price     = doc.getDouble("price");
        item.imageURL  = doc.getString("imageURL");
        item.productId = doc.contains("productId") ? (int) doc.getLong("productId") : null;
        item.sku       = doc.getString("sku");
        item.unit      = doc.getString("unit");
        item.quantity  = readQuantity(doc);
        return item;
    }

    /**
     * Capella stores the live inventory count in {@code stockQty}. The seeded
     * documents and other platforms (web, iOS, Android, .NET) also keep a
     * separate {@code quantity} field as a P2P CRDT counter — we treat
     * {@code stockQty} as authoritative, then fall back to {@code quantity.value}
     * (CRDT dict shape) and finally to a flat {@code quantity} int for older
     * data.
     */
    private static int readQuantity(Document doc) {
        if (doc.contains("stockQty")) {
            int v = (int) doc.getLong("stockQty");
            if (v > 0) return v;
        }
        var crdt = doc.getDictionary("quantity");
        if (crdt != null && crdt.contains("value")) {
            return (int) crdt.getLong("value");
        }
        if (doc.contains("quantity")) {
            return (int) doc.getLong("quantity");
        }
        return 0;
    }

    public MutableDocument toMutable() {
        MutableDocument doc = id != null ? new MutableDocument(id) : new MutableDocument();
        doc.setString("name", name)
           .setString("type", type != null ? type : "")
           .setDouble("price", price)
           .setString("imageURL", imageURL != null ? imageURL : "")
           .setLong("stockQty", quantity);
        if (productId != null) doc.setLong("productId", productId);
        if (sku != null)       doc.setString("sku", sku);
        if (unit != null)      doc.setString("unit", unit);
        return doc;
    }

    public String getId()           { return id; }
    public void setId(String id)    { this.id = id; }
    public String getName()         { return name; }
    public String getType()         { return type; }
    public double getPrice()        { return price; }
    public String getImageURL()     { return imageURL; }
    public int getQuantity()        { return quantity; }
    public void setQuantity(int q)  { this.quantity = q; }
    public Integer getProductId()   { return productId; }
    public String getSku()          { return sku; }
    public String getUnit()         { return unit; }
}
