package com.couchbase.grocery.models;

import com.couchbase.lite.Dictionary;
import com.couchbase.lite.Document;

/**
 * Store profile document. Schema matches the seeded Capella docs and the
 * Android port's {@code StoreProfile.kt} — name at root, contact + location
 * are nested dictionaries.
 */
public class StoreProfile {
    private String id;
    private String storeId;
    private String name;        // store display name (root level)
    private String email;
    private String phone;
    private String address1;
    private String address2;
    private String locality;
    private String region;
    private String postalCode;
    private String country;
    private Double latitude;
    private Double longitude;
    private String manager;
    private String openingHours;

    public static StoreProfile fromDocument(Document doc) {
        StoreProfile p = new StoreProfile();
        p.id            = doc.getId();
        p.storeId       = doc.getString("storeId");
        p.name          = doc.getString("name");
        p.manager       = doc.getString("manager");
        p.openingHours  = doc.getString("openingHours");

        Dictionary contact = doc.getDictionary("contact");
        if (contact != null) {
            p.email = contact.getString("email");
            p.phone = contact.getString("phone");
        }

        Dictionary location = doc.getDictionary("location");
        if (location != null) {
            p.address1   = location.getString("address1");
            p.address2   = location.getString("address2");
            p.locality   = location.getString("locality");
            p.region     = location.getString("region");
            p.postalCode = location.getString("postalCode");
            p.country    = location.getString("country");
            Dictionary coords = location.getDictionary("coordinates");
            if (coords != null) {
                if (coords.contains("lat")) p.latitude = coords.getDouble("lat");
                if (coords.contains("lon")) p.longitude = coords.getDouble("lon");
            }
        }
        return p;
    }

    public String getId()          { return id; }
    public String getStoreId()     { return storeId; }
    public String getName()        { return name; }
    public String getEmail()       { return email; }
    public String getPhone()       { return phone; }
    public String getAddress1()    { return address1; }
    public String getAddress2()    { return address2; }
    public String getLocality()    { return locality; }
    public String getRegion()      { return region; }
    public String getPostalCode()  { return postalCode; }
    public String getCountry()     { return country; }
    public Double getLatitude()    { return latitude; }
    public Double getLongitude()   { return longitude; }
    public String getManager()     { return manager; }
    public String getOpeningHours(){ return openingHours; }
}
