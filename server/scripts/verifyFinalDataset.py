import csv

print("\n📊 VERIFYING THESIS_READY_DATASET.csv\n")
print("="*80)

with open('server/exports/THESIS_READY_DATASET.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    rows = list(reader)
    
    print(f"\n✅ Total rows: {len(rows)}")
    
    # Check experimental with rationales
    experimental_with_rationales = [r for r in rows if r['taskType'] == 'experimental' and r['reflection'] == 'required' and int(r['rationaleCount']) > 0]
    print(f"✅ Experimental sessions with rationales: {len(experimental_with_rationales)}")
    
    if experimental_with_rationales:
        sample = experimental_with_rationales[0]
        print(f"\n📋 Sample experimental session:")
        print(f"   Participant: {sample['participantId']}")
        print(f"   Condition: {sample['timing']} + {sample['reflection']}")
        print(f"   Ideas: {sample['ideasList'][:80]}...")
        print(f"   Rationale count: {sample['rationaleCount']}")
        print(f"   Rationale text: {sample['rationaleTexts'][:120]}...")
        print(f"   Reflection depth: {sample['avgReflectionDepth']}")
    
    # Check transfer tasks
    transfer = [r for r in rows if r['taskType'] == 'transfer_baseline']
    print(f"\n✅ Transfer tasks (no AI): {len(transfer)}")
    
    if transfer:
        sample = transfer[0]
        print(f"\n📋 Sample transfer task:")
        print(f"   Participant: {sample['participantId']}")
        print(f"   Task type: {sample['taskType']}")
        print(f"   Ideas: {sample['ideasList'][:100]}...")
        print(f"   AI suggestions: {sample['totalAISuggestions']}")
        print(f"   Rationales: {sample['rationaleCount']} (should be 0)")
    
    print("\n" + "="*80)
    print("\n🎉 VERIFICATION COMPLETE!")
    print(f"\n✅ Rationales: {'PRESENT' if len(experimental_with_rationales) > 0 else 'MISSING'}")
    print(f"✅ Transfer tasks: {'PRESENT' if len(transfer) > 0 else 'MISSING'}")
    print(f"✅ Ideas in transfer: {'PRESENT' if transfer and len(transfer[0]['ideasList']) > 10 else 'MISSING'}")
    print()
