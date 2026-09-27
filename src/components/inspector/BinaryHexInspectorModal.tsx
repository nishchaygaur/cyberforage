import React, { useState } from 'react';
import { Binary, ShieldAlert, Cpu, Eye, CheckCircle2, X, Terminal, Filter } from 'lucide-react';
import { cyberSound } from '../../audio/cyberSoundEngine';

interface InstructionLine {
  offset: string;
  bytes: string;
  opcode: string;
  ascii: string;
  category: 'normal' | 'nop_sled' | 'shellcode_hook' | 'anti_debug' | 'rop_gadget';
  annotation?: string;
}

const BINARY_DUMP: InstructionLine[] = [
  { offset: '0x00401000', bytes: '55', opcode: 'push rbp', ascii: 'U', category: 'normal', annotation: 'Standard stack frame prologue initialization' },
  { offset: '0x00401001', bytes: '48 89 E5', opcode: 'mov rbp, rsp', ascii: 'H..', category: 'normal', annotation: 'Preserve stack pointer base in RBP' },
  { offset: '0x00401004', bytes: '65 48 8B 04 25 30 00', opcode: 'mov rax, gs:[0x60]', ascii: 'eH..%0.', category: 'anti_debug', annotation: 'CRITICAL: Inspects Process Environment Block (PEB) BeingDebugged flag (Evasion)' },
  { offset: '0x0040100B', bytes: '0F B6 40 02', opcode: 'movzx eax, byte [rax+2]', ascii: '..@.', category: 'anti_debug', annotation: 'Dereference BeingDebugged byte. If 1, exits process prematurely' },
  { offset: '0x0040100F', bytes: '85 C0', opcode: 'test eax, eax', ascii: '..', category: 'normal', annotation: 'Test debugger active condition' },
  { offset: '0x00401011', bytes: '75 2B', opcode: 'jnz evasion_stub', ascii: 'u+', category: 'normal', annotation: 'Branch to clean evasion shutdown if detected' },
  { offset: '0x00401013', bytes: '90 90 90 90', opcode: 'nop; nop; nop; nop', ascii: '....', category: 'nop_sled', annotation: 'NOP Sled (0x90): Weaponized slide sequence to align execution alignment' },
  { offset: '0x00401017', bytes: '90 90 90 90', opcode: 'nop; nop; nop; nop', ascii: '....', category: 'nop_sled', annotation: 'NOP Sled padding for reliable shellcode landing' },
  { offset: '0x0040101B', bytes: '48 31 C0', opcode: 'xor rax, rax', ascii: 'H1.', category: 'shellcode_hook', annotation: 'Clear RAX register for Linux/Windows system call' },
  { offset: '0x0040101E', bytes: '50', opcode: 'push rax', ascii: 'P', category: 'shellcode_hook', annotation: 'Null-terminate string on stack (avoids null bytes in payload)' },
  { offset: '0x0040101F', bytes: '48 BB 2F 62 69 6E 2F 2F 73 68', opcode: 'mov rbx, 0x68732F2F6E69622F', ascii: 'H./bin//sh', category: 'shellcode_hook', annotation: 'Push string "/bin//sh" to register (Syscall Target)' },
  { offset: '0x00401029', bytes: '53', opcode: 'push rbx', ascii: 'S', category: 'shellcode_hook', annotation: 'Place pointer to executable path onto execution stack' },
  { offset: '0x0040102A', bytes: '48 89 E7', opcode: 'mov rdi, rsp', ascii: 'H..', category: 'shellcode_hook', annotation: 'Set arg0 (filename pointer) for sys_execve' },
  { offset: '0x0040102D', bytes: '48 31 F6', opcode: 'xor rsi, rsi', ascii: 'H1.', category: 'shellcode_hook', annotation: 'Arg1 (argv) = NULL' },
  { offset: '0x00401030', bytes: '48 31 D2', opcode: 'xor rdx, rdx', ascii: 'H1.', category: 'shellcode_hook', annotation: 'Arg2 (envp) = NULL' },
  { offset: '0x00401033', bytes: 'B0 3B', opcode: 'mov al, 59', ascii: '.;', category: 'shellcode_hook', annotation: 'Syscall number 59 (sys_execve on Linux x86_64)' },
  { offset: '0x00401035', bytes: '0F 05', opcode: 'syscall', ascii: '..', category: 'shellcode_hook', annotation: 'TRIGGER SYSCALL: Kernel privilege execution of /bin/sh' },
  { offset: '0x00401037', bytes: '5F C3', opcode: 'pop rdi; ret', ascii: '_.', category: 'rop_gadget', annotation: 'ROP Gadget: pop rdi; ret — used for control-flow hijacking' },
];

interface BinaryHexInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  binaryName?: string;
}

export const BinaryHexInspectorModal: React.FC<BinaryHexInspectorModalProps> = ({
  isOpen,
  onClose,
  binaryName = 'libmalware_loader.elf',
}) => {
  const [filter, setFilter] = useState<'all' | 'anti_debug' | 'nop_sled' | 'shellcode_hook' | 'rop_gadget'>('all');
  const [selectedLine, setSelectedLine] = useState<InstructionLine>(BINARY_DUMP[2]);

  if (!isOpen) return null;

  const filtered = BINARY_DUMP.filter((l) => (filter === 'all' ? true : l.category === filter));

  const handleSelectLine = (line: InstructionLine) => {
    cyberSound.playClick();
    setSelectedLine(line);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl rounded-2xl bg-[#030914] border border-[#00F0C0]/50 shadow-[0_0_50px_rgba(0,240,192,0.25)] flex flex-col max-h-[90vh] overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#061224]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#00F0C0]/15 border border-[#00F0C0]/40 flex items-center justify-center">
              <Binary className="w-4 h-4 text-[#00F0C0]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-mono font-bold tracking-wider text-white uppercase">
                  Binary Disassembler & Hex Inspector
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-[#00F0C0]">
                  ELF x86_64
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Target Artifact: <span className="text-white font-semibold">{binaryName}</span> (Disassembled via CyberForge Engine)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="p-4 bg-[#051122]/70 border-b border-white/10 flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-slate-400 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-[#00F0C0]" /> Highlights:
          </span>
          {[
            { id: 'all', label: 'All Opcodes' },
            { id: 'anti_debug', label: 'Anti-Debug PEB Checks' },
            { id: 'nop_sled', label: 'NOP Sleds' },
            { id: 'shellcode_hook', label: 'Syscall / Shellcode' },
            { id: 'rop_gadget', label: 'ROP Gadgets' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => {
                cyberSound.playClick();
                setFilter(f.id as typeof filter);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                filter === f.id
                  ? 'bg-[#00F0C0]/20 border border-[#00F0C0] text-[#00F0C0] shadow-[0_0_10px_rgba(0,240,192,0.3)]'
                  : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Main Disassembly Table */}
        <div className="flex-1 overflow-y-auto p-4 bg-[#02060E]">
          <div className="font-mono text-xs border border-white/10 rounded-xl overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-[#061426] text-slate-400 border-b border-white/10 text-[11px] font-bold">
              <div className="col-span-2">OFFSET</div>
              <div className="col-span-3">HEX BYTES</div>
              <div className="col-span-4">OPCODE (x86_64)</div>
              <div className="col-span-3">ASCII / HEURISTIC</div>
            </div>

            {/* Instruction Rows */}
            <div className="divide-y divide-white/5">
              {filtered.map((line, idx) => {
                const isSelected = selectedLine?.offset === line.offset;
                const badgeColor =
                  line.category === 'shellcode_hook'
                    ? 'text-rose-400 bg-rose-500/10 border-rose-500/30'
                    : line.category === 'anti_debug'
                    ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                    : line.category === 'nop_sled'
                    ? 'text-purple-400 bg-purple-500/10 border-purple-500/30'
                    : line.category === 'rop_gadget'
                    ? 'text-sky-400 bg-sky-500/10 border-sky-500/30'
                    : 'text-slate-400';

                return (
                  <div
                    key={idx}
                    onClick={() => handleSelectLine(line)}
                    className={`grid grid-cols-12 gap-2 px-4 py-2 items-center cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#00F0C0]/15 border-l-2 border-[#00F0C0] text-white'
                        : 'hover:bg-white/[0.03] text-slate-300'
                    }`}
                  >
                    <div className="col-span-2 text-slate-500">{line.offset}</div>
                    <div className="col-span-3 text-[#38BDF8]">{line.bytes}</div>
                    <div className="col-span-4 font-bold text-white">{line.opcode}</div>
                    <div className="col-span-3 flex items-center justify-between">
                      <span className="text-slate-400 font-mono">{line.ascii}</span>
                      {line.category !== 'normal' && (
                        <span className={`text-[9px] px-1.5 py-0.5 rounded border uppercase font-bold ${badgeColor}`}>
                          {line.category.replace('_', ' ')}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Opcode Inspector Drawer */}
        {selectedLine && (
          <div className="p-4 bg-[#051122] border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#00F0C0] font-bold">
                  {selectedLine.offset}: {selectedLine.opcode}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400">
                  Bytes: {selectedLine.bytes}
                </span>
              </div>
              <p className="text-xs font-mono text-slate-300">
                {selectedLine.annotation || 'Standard execution instruction.'}
              </p>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${selectedLine.offset} ${selectedLine.opcode}`);
                  cyberSound.playClick();
                }}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-300 transition-colors"
              >
                Copy Instruction
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
