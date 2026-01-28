import { AnalysisResult } from "@/types/data-contract";

export type DiffResult = {
    addedCapabilities: AnalysisResult["capabilities"];
    removedCapabilities: AnalysisResult["capabilities"];
    addedConstraints: AnalysisResult["constraints"];
    removedConstraints: AnalysisResult["constraints"];
};

export function compareAnalysis(oldResult: AnalysisResult, newResult: AnalysisResult): DiffResult {
    const diff: DiffResult = {
        addedCapabilities: [],
        removedCapabilities: [],
        addedConstraints: [],
        removedConstraints: [],
    };

    // Compare Capabilities (Naive comparison by action + target)
    const oldCaps = new Set(oldResult.capabilities.map(c => `${c.action}|${c.target}`));
    const newCaps = new Set(newResult.capabilities.map(c => `${c.action}|${c.target}`));

    newResult.capabilities.forEach(cap => {
        if (!oldCaps.has(`${cap.action}|${cap.target}`)) {
            diff.addedCapabilities.push(cap);
        }
    });

    oldResult.capabilities.forEach(cap => {
        if (!newCaps.has(`${cap.action}|${cap.target}`)) {
            diff.removedCapabilities.push(cap);
        }
    });

    // Compare Constraints (Naive comparison by requirement text)
    const oldCons = new Set(oldResult.constraints.map(c => c.requirement));
    const newCons = new Set(newResult.constraints.map(c => c.requirement));

    newResult.constraints.forEach(con => {
        if (!oldCons.has(con.requirement)) {
            diff.addedConstraints.push(con);
        }
    });

    oldResult.constraints.forEach(con => {
        if (!newCons.has(con.requirement)) {
            diff.removedConstraints.push(con);
        }
    });

    return diff;
}
