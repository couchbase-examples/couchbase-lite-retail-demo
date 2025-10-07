//
//  CRDTCounter.swift
//  LiquorApp
//
//  Created by Pulkit Midha on 23/07/25.
//

import Foundation
import CouchbaseLiteSwift

// MARK: - CRDT Counter

class CRDTCounter {
    private let document: Document
    private let key: String

    init(document: Document, key: String) {
        self.document = document
        self.key = key
    }
    
    var value: Int {
        // Get the counter and return the merged value.
        let counter = document[key].dictionary
        return counter?["value"].int ?? 0
    }
}

// MutableCRDTCounter manages the counter value of a document field using the
// CRDT structure for conflict-free replication across P2P devices.
class MutableCRDTCounter: CRDTCounter {
    private let document: MutableDocument
    private let key: String
    private let actor: String

    init(document: MutableDocument, key: String, actor: String) {
        self.document = document
        self.key = key
        self.actor = actor
        
        super.init(document: document, key: key)
    }
    
    func increment(by amount: UInt) {
        // Get the counter.
        let counter = document[key].dictionary ?? {
            let counter = MutableDictionaryObject(data: ["type": "pn-counter"])
            document[key].dictionary = counter
            return counter
        }()
        
        // Get the positive counter.
        let p = counter["p"].dictionary ?? {
            let p = MutableDictionaryObject()
            counter["p"].dictionary = p
            return p
        }()
        
        // Increment the value for the actor.
        p[actor].int += Int(amount)
        
        // Set the new value.
        counter["value"].int = computeValue(p: p, n: counter["n"].dictionary)
    }

    func decrement(by amount: UInt) {
        // Get the counter.
        let counter = document[key].dictionary ?? {
            let counter = MutableDictionaryObject(data: ["type": "pn-counter"])
            document[key].dictionary = counter
            return counter
        }()
        
        // Get the negative counter.
        let n = counter["n"].dictionary ?? {
            let n = MutableDictionaryObject()
            counter["n"].dictionary = n
            return n
        }()
        
        // Decrement the value for the actor.
        n[actor].int += Int(amount)
        
        // Set the new value.
        counter["value"].int = computeValue(p: counter["p"].dictionary, n: n)
    }
    
    private func computeValue(p: DictionaryObject?, n: DictionaryObject?) -> Int {
        // Sum the positive counter values.
        let pCounterValue = p?.toDictionary().values.reduce(0, { partialResult, value in
            guard let value = value as? Int else { return partialResult }
            return partialResult + value
        }) ?? 0
        
        // Sum the negative counter values.
        let nCounterValue = n?.toDictionary().values.reduce(0, { partialResult, value in
            guard let value = value as? Int else { return partialResult }
            return partialResult + value
        }) ?? 0
        
        // Return the difference between positive and negative counter values.
        return max(0, pCounterValue - nCounterValue) // Ensure non-negative quantities
    }
}

// MARK: - Couchbase Lite Extensions

extension CouchbaseLiteSwift.Document {
    func crdtCounter(forKey key: String) -> CRDTCounter? {
        return CRDTCounter(document: self, key: key)
    }
}

extension CouchbaseLiteSwift.MutableDocument {
    func crdtCounter(forKey key: String, actor: String) -> MutableCRDTCounter {
        return MutableCRDTCounter(document: self, key: key, actor: actor)
    }
}

// MARK: - CRDT Conflict Resolver

// LiquorCRDTConflictResolver resolves conflicts for documents that contain
// top-level fields of type "pn-counter" using CRDT logic. For all other fields,
// it uses the default conflict resolver provided by Couchbase Lite.
class LiquorCRDTConflictResolver: ConflictResolverProtocol {
    static let shared: LiquorCRDTConflictResolver = LiquorCRDTConflictResolver()
    
    func resolve(conflict: Conflict) -> Document? {
        // Use the default conflict resolver for initial resolution.
        let defaultResolver = ConflictResolver.default
        guard let resolvedDoc = defaultResolver.resolve(conflict: conflict)?.toMutable() else {
            return nil
        }
        
        // If either the localDocument or remoteDocument are null, return the default resolved doc.
        guard let localDocument = conflict.localDocument, let remoteDocument = conflict.remoteDocument else {
            return resolvedDoc
        }
        
        // Iterate over all keys in the local and remote documents.
        let localAndRemoteKeys = Set(localDocument.keys).union(remoteDocument.keys)
        for key in localAndRemoteKeys {
            // Check if either the local or remote document has a "pn-counter" type field for the current key.
            if localDocument[key].dictionary?["type"].string == "pn-counter" || 
               remoteDocument[key].dictionary?["type"].string == "pn-counter" {
                
                print("[LiquorSync] Resolving CRDT conflict for key: \(key)")
                
                // Initialize counters for the positive (p) and negative (n) values.
                var pCounterValue = 0
                var nCounterValue = 0

                // Iterate over the "p" and "n" keys.
                for counterKey in ["p", "n"] {
                    // Get the "p" or "n" dictionary from the local and remote documents.
                    let localCounter = localDocument[key].dictionary?[counterKey].dictionary ?? MutableDictionaryObject()
                    let remoteCounter = remoteDocument[key].dictionary?[counterKey].dictionary ?? MutableDictionaryObject()
                    
                    // Initialize a new dictionary to hold the merged counter values.
                    let mergedCounter = MutableDictionaryObject()

                    // Iterate over all actors in the local and remote counters.
                    let allActors = Set(localCounter.keys).union(remoteCounter.keys)
                    for actor in allActors {
                        // Get the local and remote values for the current actor.
                        let localValue = localCounter[actor].int
                        let remoteValue = remoteCounter[actor].int
                        
                        // The merged value is the maximum of the local and remote values.
                        let maxValue = max(localValue, remoteValue)
                        mergedCounter[actor].int = maxValue

                        // Add the merged value to the appropriate counter.
                        if counterKey == "p" {
                            pCounterValue += maxValue
                        } else if counterKey == "n" {
                            nCounterValue += maxValue
                        }
                    }

                    // Set the merged counter in the resolved document.
                    if mergedCounter.count > 0 {
                        // Ensure the counter structure exists
                        if resolvedDoc[key].dictionary == nil {
                            resolvedDoc[key].dictionary = MutableDictionaryObject(data: ["type": "pn-counter"])
                        }
                        resolvedDoc[key].dictionary?[counterKey].dictionary = mergedCounter
                    }
                }

                // Set the "value" field to the difference between positive and negative counters.
                let finalValue = max(0, pCounterValue - nCounterValue) // Ensure non-negative
                resolvedDoc[key].dictionary?["value"].int = finalValue
                
                print("[LiquorSync] CRDT conflict resolved: \(key) = \(finalValue)")
            }
        }

        return resolvedDoc
    }
}

// MARK: - Database UUID Extension

extension CouchbaseLiteSwift.Database {
    var deviceUUID: String {
        let key = "\(name).device.uuid"
        guard let uuid = UserDefaults.standard.string(forKey: key) else {
            let uuid = UUID().uuidString
            UserDefaults.standard.set(uuid, forKey: key)
            print("[LiquorSync] Generated new device UUID: \(uuid)")
            return uuid
        }
        return uuid
    }
} 