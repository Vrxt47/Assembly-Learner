import { useState, useEffect } from 'react';
import { ChevronRight, Play, Pause, RotateCcw, StepForward } from 'lucide-react';

function Simulator() {
  const [registers, setRegisters] = useState({
    eax: 0,
    ebx: 0,
    ecx: 0,
    edx: 0,
    esi: 0,
    edi: 0,
  });
  
  const [memory, setMemory] = useState(Array(16).fill(0));
  const [code, setCode] = useState(
    '; Simple CPU simulation\nmov eax, 5\nmov ebx, 10\nadd eax, ebx\nmov [0], eax'
  );
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [executionLog, setExecutionLog] = useState<string[]>([]);
  const [instructions, setInstructions] = useState<string[]>([]);

  useEffect(() => {
    // Parse the code into instructions
    const lines = code.split('\n').filter(line => 
      line.trim() && !line.trim().startsWith(';')
    );
    setInstructions(lines);
  }, [code]);

  const resetSimulation = () => {
    setRegisters({
      eax: 0,
      ebx: 0,
      ecx: 0,
      edx: 0,
      esi: 0,
      edi: 0,
    });
    setMemory(Array(16).fill(0));
    setCurrentStep(0);
    setExecutionLog([]);
    setIsRunning(false);
  };

  const executeStep = () => {
    if (currentStep >= instructions.length) {
      setIsRunning(false);
      return;
    }

    const instruction = instructions[currentStep].split(';')[0].trim();
    let newRegisters = { ...registers };
    let newMemory = [...memory];
    let log = `Step ${currentStep + 1}: Executing "${instruction}"`;

    // Extract operation and operands
    const operation = instruction.split(' ')[0].toLowerCase();
    const operandsString = instruction.substring(instruction.indexOf(' ') + 1);
    const parts = operandsString.split(',').map(part => part.trim());
    const dest = parts[0];
    const source = parts.length > 1 ? parts[1] : '';

    switch (operation) {
      case 'mov':
        // Memory access [address]
        if (dest.startsWith('[') && dest.endsWith(']')) {
          const address = parseInt(dest.substring(1, dest.length - 1));
          if (source in newRegisters) {
            newMemory[address] = newRegisters[source as keyof typeof registers];
            log += ` → Memory[${address}] = ${newRegisters[source as keyof typeof registers]}`;
          } else {
            const value = parseInt(source);
            newMemory[address] = value;
            log += ` → Memory[${address}] = ${value}`;
          }
        } else if (dest in newRegisters) {
          if (source.startsWith('[') && source.endsWith(']')) {
            const address = parseInt(source.substring(1, source.length - 1));
            newRegisters[dest as keyof typeof registers] = newMemory[address];
            log += ` → ${dest} = Memory[${address}] (${newMemory[address]})`;
          } else if (source in newRegisters) {
            newRegisters[dest as keyof typeof registers] = newRegisters[source as keyof typeof registers];
            log += ` → ${dest} = ${source} (${newRegisters[source as keyof typeof registers]})`;
          } else {
            const value = parseInt(source);
            newRegisters[dest as keyof typeof registers] = value;
            log += ` → ${dest} = ${value}`;
          }
        }
        break;

      case 'add':
        if (dest in newRegisters) {
          if (source in newRegisters) {
            newRegisters[dest as keyof typeof registers] += newRegisters[source as keyof typeof registers];
            log += ` → ${dest} += ${source} (${newRegisters[dest as keyof typeof registers]})`;
          } else {
            const value = parseInt(source);
            newRegisters[dest as keyof typeof registers] += value;
            log += ` → ${dest} += ${value} (${newRegisters[dest as keyof typeof registers]})`;
          }
        }
        break;

      case 'sub':
        if (dest in newRegisters) {
          if (source in newRegisters) {
            newRegisters[dest as keyof typeof registers] -= newRegisters[source as keyof typeof registers];
            log += ` → ${dest} -= ${source} (${newRegisters[dest as keyof typeof registers]})`;
          } else {
            const value = parseInt(source);
            newRegisters[dest as keyof typeof registers] -= value;
            log += ` → ${dest} -= ${value} (${newRegisters[dest as keyof typeof registers]})`;
          }
        }
        break;

        case 'mul':
    // x86 mul instruction takes one operand (register or memory)
    // Multiplies with eax, stores result in edx:eax
    if (dest in newRegisters) {
        const multiplier = newRegisters[dest as keyof typeof registers];
        const product = newRegisters.eax * multiplier;
        
        // Store low 32 bits in eax
        newRegisters.eax = product & 0xFFFFFFFF;
        
        // Store high 32 bits in edx
        newRegisters.edx = (product >> 32) & 0xFFFFFFFF;
        
        log += ` → eax × ${dest} = ${product} (eax=${newRegisters.eax}, edx=${newRegisters.edx})`;
    } else if (dest.startsWith('[') && dest.endsWith(']')) {
        // Memory operand
        const address = parseInt(dest.substring(1, dest.length - 1));
        const multiplier = newMemory[address];
        const product = newRegisters.eax * multiplier;
        
        newRegisters.eax = product & 0xFFFFFFFF;
        newRegisters.edx = (product >> 32) & 0xFFFFFFFF;
        
        log += ` → eax × [${address}] = ${product} (eax=${newRegisters.eax}, edx=${newRegisters.edx})`;
    } else {
        // Immediate value (not standard in x86 but we'll support it)
        const value = parseInt(dest);
        if (!isNaN(value)) {
            const product = newRegisters.eax * value;
            
            newRegisters.eax = product & 0xFFFFFFFF;
            newRegisters.edx = (product >> 32) & 0xFFFFFFFF;
            
            log += ` → eax × ${value} = ${product} (eax=${newRegisters.eax}, edx=${newRegisters.edx})`;
        } else {
            log += ` → Error: Invalid operand for mul`;
        }
    }
    break;
  
    
   

        case 'xor':
            if (dest in newRegisters) {
                let sourceValue: number;
                
                // Handle memory reference [address]
                if (source.startsWith('[') && source.endsWith(']')) {
                    const address = parseInt(source.substring(1, source.length - 1));
                    sourceValue = newMemory[address];
                    log += ` → ${dest} ^= [${address}] (${sourceValue})`;
                }
                // Handle register
                else if (source in newRegisters) {
                    sourceValue = newRegisters[source as keyof typeof registers];
                    log += ` → ${dest} ^= ${source} (${sourceValue})`;
                }
                // Handle immediate value
                else {
                    sourceValue = parseInt(source);
                    if (isNaN(sourceValue)) {
                        log += ` → Error: Invalid operand for xor`;
                        break;
                    }
                    log += ` → ${dest} ^= ${sourceValue}`;
                }
                
                newRegisters[dest as keyof typeof registers] ^= sourceValue;
                log += ` = ${newRegisters[dest as keyof typeof registers]}`;
            } else {
                log += ` → Error: Invalid destination for xor`;
            }
            break;

      default:
        log += ` → Unknown instruction`;
        break;
    }

    setRegisters(newRegisters);
    setMemory(newMemory);
    setExecutionLog(prev => [...prev, log]);
    setCurrentStep(prev => prev + 1);
  };

  const toggleExecution = () => {
    setIsRunning(!isRunning);
  };

  useEffect(() => {
    let interval: number;
    
    if (isRunning) {
      interval = window.setInterval(() => {
        executeStep();
      }, 1000);
    }

    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [isRunning, currentStep, instructions]);

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">CPU Simulator</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Code Editor */}
        <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Assembly Code</h2>
          <textarea
            className="w-full h-64 p-4 font-mono text-sm bg-gray-50 border rounded-md"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          
          <div className="flex space-x-4 mt-4">
            <button 
              onClick={resetSimulation}
              className="flex items-center px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </button>
            
            <button 
              onClick={toggleExecution}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              disabled={currentStep >= instructions.length}
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Run
                </>
              )}
            </button>
            
            <button 
              onClick={executeStep}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              disabled={currentStep >= instructions.length || isRunning}
            >
              <StepForward className="w-4 h-4 mr-2" />
              Step
            </button>
          </div>
        </div>
        
        {/* CPU State */}
        <div>
          {/* Registers */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Registers</h2>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(registers).map(([reg, value]) => (
                <div key={reg} className="flex justify-between p-2 bg-gray-50 rounded border">
                  <span className="font-mono">{reg}</span>
                  <span className="font-mono text-blue-600">{value}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Memory */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Memory</h2>
            <div className="grid grid-cols-4 gap-2">
              {memory.map((value, index) => (
                <div key={index} className="flex justify-between p-2 bg-gray-50 rounded border">
                  <span className="font-mono text-xs">[{index}]</span>
                  <span className="font-mono text-green-600">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Execution Log */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">Execution Log</h2>
        <div className="bg-gray-50 p-4 rounded-md border h-48 overflow-y-auto font-mono text-sm">
          {executionLog.length > 0 ? (
            executionLog.map((log, index) => (
              <div key={index} className="mb-1">
                <ChevronRight className="inline w-4 h-4 mr-1 text-gray-500" />
                {log}
              </div>
            ))
          ) : (
            <p className="text-gray-500">Execution log will appear here...</p>
          )}
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-800 mb-2">How to use the simulator:</h3>
        <ol className="list-decimal ml-5 space-y-1 text-sm">
          <li>Write assembly code in the editor (supported instructions: mov, add, sub, mul, xor)</li>
          <li>Click "Run" to execute all instructions or "Step" to execute one at a time</li>
          <li>Watch how registers and memory change with each instruction</li>
          <li>Use the execution log to understand what each instruction does</li>
        </ol>
      </div>
    </div>
  );
}

export default Simulator;