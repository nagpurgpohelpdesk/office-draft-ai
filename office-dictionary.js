/*
 * OfficeDraft AI
 * Office Language and Abbreviation Dictionary
 *
 * This module provides context-aware suggestions.
 * Ambiguous abbreviations must not be expanded blindly.
 */

(function (global) {
  "use strict";

  const abbreviations = {
    "LPC": {
      expansion: "Local Purchase Committee",
      category: "Procurement",
      confidence: "high"
    },

    "SSPO": {
      expansion: "Senior Superintendent of Post Offices",
      category: "Administration",
      confidence: "high"
    },

    "SPO": {
      expansion: "Superintendent of Post Offices",
      category: "Administration",
      confidence: "high"
    },

    "HO": {
      expansion: "Head Office",
      category: "Postal Office",
      confidence: "high"
    },

    "SO": {
      expansion: "Sub Office",
      category: "Postal Office",
      confidence: "high"
    },

    "BO": {
      expansion: "Branch Office",
      category: "Postal Office",
      confidence: "high"
    },

    "PLI": {
      expansion: "Postal Life Insurance",
      category: "Insurance",
      confidence: "high"
    },

    "RPLI": {
      expansion: "Rural Postal Life Insurance",
      category: "Insurance",
      confidence: "high"
    },

    "POSB": {
      expansion: "Post Office Savings Bank",
      category: "Savings",
      confidence: "high"
    },

    "IPPB": {
      expansion: "India Post Payments Bank",
      category: "Banking",
      confidence: "high"
    },

    "CBS": {
      expansion: "Core Banking Solution",
      category: "Banking",
      confidence: "high"
    },

    "DDO": {
      expansion: "Drawing and Disbursing Officer",
      category: "Accounts",
      confidence: "high"
    },

    "DO": {
      expansion: null,
      alternatives: [
        "Divisional Office",
        "Drawing Office"
      ],
      category: "Administration",
      confidence: "context_required"
    },

    "PA": {
      expansion: "Postal Assistant",
      category: "Staff",
      confidence: "high"
    },

    "PM": {
      expansion: null,
      alternatives: [
        "Postmaster",
        "Postal Manager"
      ],
      category: "Administration",
      confidence: "context_required"
    },

    "MTS": {
      expansion: "Multi Tasking Staff",
      category: "Staff",
      confidence: "high"
    },

    "GDS": {
      expansion: "Gramin Dak Sevak",
      category: "Staff",
      confidence: "high"
    },

    "TRCA": {
      expansion: "Time Related Continuity Allowance",
      category: "Staff",
      confidence: "high"
    },

    "MACP": {
      expansion: "Modified Assured Career Progression",
      category: "Service Matters",
      confidence: "high"
    },

    "APAR": {
      expansion: "Annual Performance Appraisal Report",
      category: "Service Matters",
      confidence: "high"
    },

    "LTC": {
      expansion: "Leave Travel Concession",
      category: "Service Matters",
      confidence: "high"
    },

    "NOC": {
      expansion: "No Objection Certificate",
      category: "Administration",
      confidence: "high"
    },

    "RTI": {
      expansion: "Right to Information",
      category: "Legal and Administrative",
      confidence: "high"
    },

    "SOP": {
      expansion: "Standard Operating Procedure",
      category: "Administration",
      confidence: "high"
    },

    "UC": {
      expansion: "Utilization Certificate",
      category: "Accounts",
      confidence: "context_required"
    },

    "TA": {
      expansion: null,
      alternatives: [
        "Travelling Allowance",
        "Technical Assistant"
      ],
      category: "Accounts and Staff",
      confidence: "context_required"
    },

    "DA": {
      expansion: "Dearness Allowance",
      category: "Accounts",
      confidence: "high"
    },

    "LPCERT": {
      expansion: "Last Pay Certificate",
      category: "Accounts",
      confidence: "high"
    }
  };

  const phraseRules = [
    {
      patterns: [
        /\bput up for orders\b/i,
        /\bsubmit for orders\b/i,
        /\bsubmitted for orders\b/i
      ],
      suggestion: "Submitted for kind perusal and orders, please."
    },

    {
      patterns: [
        /\bput up for approval\b/i,
        /\bsubmit for approval\b/i
      ],
      suggestion:
        "Submitted for kind consideration and approval, please."
    },

    {
      patterns: [
        /\bfor information\b/i,
        /\bsubmit for information\b/i
      ],
      suggestion: "Submitted for kind information, please."
    },

    {
      patterns: [
        /\bplease verify\b/i,
        /\bneed verification\b/i,
        /\bverify details\b/i
      ],
      suggestion:
        "Verification of the relevant details is requested."
    },

    {
      patterns: [
        /\breminder for pending reply\b/i,
        /\bpending reply reminder\b/i,
        /\bsend reminder\b/i
      ],
      suggestion:
        "A reminder may be issued regarding the pending reply."
    },

    {
      patterns: [
        /\bletter received\b/i,
        /\breceived letter\b/i
      ],
      suggestion:
        "The letter received in this matter is submitted for consideration."
    },

    {
      patterns: [
        /\bdouble payment\b/i,
        /\bpaid twice\b/i,
        /\bpayment processed twice\b/i
      ],
      suggestion:
        "The payment records require verification to determine whether the payment was processed more than once."
    },

    {
      patterns: [
        /\bsalary not credited\b/i,
        /\bsalary not received\b/i
      ],
      suggestion:
        "The matter regarding non-credit of salary requires examination."
    },

    {
      patterns: [
        /\bpermission for local purchase\b/i,
        /\blocal purchase permission\b/i
      ],
      suggestion:
        "The matter regarding permission for local purchase is submitted for consideration."
    }
  ];

  function getAbbreviation(term) {
    if (!term) return null;

    const key = String(term).trim().toUpperCase();

    return abbreviations[key] || null;
  }

  function findAbbreviations(text) {
    if (!text) return [];

    const found = [];
    const seen = new Set();

    const pattern = /\b[A-Z][A-Z0-9]{1,9}\b/gi;
    const matches = String(text).match(pattern) || [];

    for (const match of matches) {
      const key = match.toUpperCase();

      if (seen.has(key)) continue;
      seen.add(key);

      const entry = abbreviations[key];

      if (entry) {
        found.push({
          abbreviation: key,
          expansion: entry.expansion,
          alternatives: entry.alternatives || [],
          category: entry.category,
          confidence: entry.confidence
        });
      }
    }

    return found;
  }

  function suggestOfficialPhrases(text) {
    if (!text) return [];

    const input = String(text);
    const suggestions = [];

    for (const rule of phraseRules) {
      if (rule.patterns.some(pattern => pattern.test(input))) {
        suggestions.push(rule.suggestion);
      }
    }

    return [...new Set(suggestions)];
  }

  function normalizePageReference(text) {
    if (!text) return "";

    const value = String(text).trim();

    const range = value.match(/^(\d+)\s*(?:to|-)\s*(\d+)$/i);

    if (range) {
      return `pages ${range[1]}/c to ${range[2]}/c`;
    }

    const pair = value.match(/^(\d+)\s+(\d+)$/);

    if (pair) {
      return `pages ${pair[1]}/c to ${pair[2]}/c`;
    }

    return value;
  }

  function analyze(text) {
    return {
      abbreviations: findAbbreviations(text),
      phraseSuggestions: suggestOfficialPhrases(text)
    };
  }

  global.OfficeDictionary = {
    abbreviations,
    getAbbreviation,
    findAbbreviations,
    suggestOfficialPhrases,
    normalizePageReference,
    analyze
  };

})(window);
