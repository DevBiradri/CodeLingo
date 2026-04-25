"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import TopBar from '../components/TopBar';
import { getMyProgress, ProgressResponse } from '../../lib/api';
import { useAuth } from '../../lib/auth-context';

const skillTree = [
  {
    id: 'variables',
    level_required: 1,
    title: 'VARIABLES & MEMORY',
    description: 'Store data values and understand allocation',
    icon: 'memory',
    subtopics: [
      { name: 'Declaration', tip: 'Declaring a variable reserves a specific amount of memory for storing data. It tells the computer "I need a box named X".', link: '/challenge/start' },
      { name: 'Assignment', tip: 'Assignment puts a value into the variable\'s memory box using the = operator.', link: '/challenge/start' },
      { name: 'Naming Conventions', tip: 'Use meaningful names. Follow your language\'s rules (e.g., camelCase or snake_case) and avoid reserved keywords.', link: '/challenge/start' }
    ],
  },
  {
    id: 'datatypes',
    level_required: 2,
    title: 'PRIMITIVE TYPES',
    description: 'The fundamental building blocks of data',
    icon: 'category',
    subtopics: [
      { name: 'Integers & Floats', tip: 'Integers are whole numbers (e.g. 5). Floats represent decimal numbers (e.g. 3.14). Floating point math can sometimes be imprecise.', link: '/challenge/start' },
      { name: 'Strings & Chars', tip: 'Strings are sequences of characters (text). Chars represent a single character.', link: '/challenge/start' },
      { name: 'Booleans', tip: 'Booleans can only have two states: true or false. They are the core of logic in programming.', link: '/challenge/start' }
    ],
  },
  {
    id: 'operators',
    level_required: 3,
    title: 'OPERATORS & MATH',
    description: 'Manipulate data and evaluate logic',
    icon: 'calculate',
    subtopics: [
      { name: 'Arithmetic', tip: 'Standard math operators: + (add), - (subtract), * (multiply), / (divide), and % (modulo).', link: '/challenge/start' },
      { name: 'Logical', tip: 'Combine boolean expressions using AND (&&), OR (||), and NOT (!).', link: '/challenge/start' },
      { name: 'Relational', tip: 'Compare values using == (equal), != (not equal), > (greater), < (less).', link: '/challenge/start' },
      { name: 'Bitwise', tip: 'Operate directly on the binary representations of numbers at the bit level.', link: '/challenge/start' }
    ],
  },
  {
    id: 'conditionals',
    level_required: 4,
    title: 'CONTROL FLOW',
    description: 'Make decisions in your code',
    icon: 'alt_route',
    subtopics: [
      { name: 'If / Else', tip: 'Executes a block of code only if a specified condition is true. Otherwise, it falls back to the else block.', link: '/challenge/start' },
      { name: 'Switch / Match', tip: 'Evaluates an expression and executes code matching that specific case. Great for handling multiple exact values.', link: '/challenge/start' },
      { name: 'Ternary Operators', tip: 'A shorthand if/else statement: (condition) ? true_value : false_value.', link: '/challenge/start' }
    ],
  },
  {
    id: 'loops',
    level_required: 5,
    title: 'ITERATION',
    description: 'Execute code repeatedly',
    icon: 'all_match',
    subtopics: [
      { name: 'For Loops', tip: 'Iterates a specific number of times. Usually contains initialization, condition, and increment expressions.', link: '/challenge/start' },
      { name: 'While Loops', tip: 'Continues to execute as long as a specified condition evaluates to true.', link: '/challenge/start' },
      { name: 'Break & Continue', tip: 'Break completely exits the loop. Continue skips the rest of the current iteration and goes to the next one.', link: '/challenge/start' }
    ],
  },
  {
    id: 'functions',
    level_required: 6,
    title: 'FUNCTIONS & SCOPE',
    description: 'Reusable logic blocks and visibility',
    icon: 'functions',
    subtopics: [
      { name: 'Parameters', tip: 'Variables that act as placeholders for the actual values (arguments) passed into a function when called.', link: '/challenge/start' },
      { name: 'Return Values', tip: 'The output a function sends back to where it was called using the return statement.', link: '/challenge/start' },
      { name: 'Global vs Local Scope', tip: 'Variables declared inside a function are local (only visible there). Variables outside are global (visible everywhere).', link: '/challenge/start' }
    ],
  },
  {
    id: 'arrays',
    level_required: 7,
    title: 'SEQUENTIAL DATA',
    description: 'Ordered collections of elements',
    icon: 'data_array',
    subtopics: [
      { name: 'Arrays / Lists', tip: 'A data structure storing multiple items in a single variable, laid out sequentially in memory.', link: '/challenge/start' },
      { name: 'Indexing', tip: 'Accessing specific array elements using their position. In most languages, indexing starts at 0.', link: '/challenge/start' },
      { name: 'Multi-dimensional Arrays', tip: 'Arrays inside arrays, often used to represent grids or matrices (e.g. array[x][y]).', link: '/challenge/start' }
    ],
  },
  {
    id: 'hashmaps',
    level_required: 8,
    title: 'KEY-VALUE STORES',
    description: 'Associative collections',
    icon: 'vpn_key',
    subtopics: [
      { name: 'Dictionaries / Maps', tip: 'Collections storing data in key-value pairs, allowing O(1) average lookup times.', link: '/challenge/start' },
      { name: 'Hashing Basics', tip: 'Converting keys into integer indexes using a hash function to determine where the value is stored in memory.', link: '/challenge/start' },
      { name: 'JSON / Structs', tip: 'Data interchange formats and records that group related variables of different types under one name.', link: '/challenge/start' }
    ],
  },
  {
    id: 'errors',
    level_required: 9,
    title: 'ERROR HANDLING',
    description: 'Managing the unexpected safely',
    icon: 'warning',
    subtopics: [
      { name: 'Exceptions', tip: 'An event that occurs during execution that disrupts the normal flow of instructions.', link: '/challenge/start' },
      { name: 'Try / Catch', tip: 'Wrap risky code in a try block, and handle any resulting errors gracefully in the catch block without crashing.', link: '/challenge/start' },
      { name: 'Custom Errors', tip: 'Creating your own specific error types to better describe what went wrong in your domain logic.', link: '/challenge/start' }
    ],
  },
  {
    id: 'fileio',
    level_required: 10,
    title: 'FILE I/O',
    description: 'Interacting with the file system',
    icon: 'folder_open',
    subtopics: [
      { name: 'Reading Files', tip: 'Opening a file from disk and loading its contents into memory as a string or buffer.', link: '/challenge/start' },
      { name: 'Writing Files', tip: 'Taking data from memory and persistently saving it to a file on the disk.', link: '/challenge/start' },
      { name: 'Streams & Buffers', tip: 'Handling data in small, continuous chunks (streams) rather than loading everything into memory at once.', link: '/challenge/start' }
    ],
  },
  {
    id: 'oop_basics',
    level_required: 11,
    title: 'OOP: BASICS',
    description: 'Modeling real-world entities',
    icon: 'data_object',
    subtopics: [
      { name: 'Classes & Objects', tip: 'A Class is a blueprint. An Object is a specific instance created from that blueprint.', link: '/challenge/start' },
      { name: 'Methods', tip: 'Functions that belong to a class and define the behaviors an object can perform.', link: '/challenge/start' },
      { name: 'Encapsulation', tip: 'Bundling data and methods together, and restricting direct access to some of an object\'s components (public/private).', link: '/challenge/start' }
    ],
  },
  {
    id: 'oop_advanced',
    level_required: 12,
    title: 'OOP: ADVANCED',
    description: 'Complex object relationships',
    icon: 'account_tree',
    subtopics: [
      { name: 'Inheritance', tip: 'A mechanism where a new class inherits properties and behaviors from an existing class.', link: '/challenge/start' },
      { name: 'Polymorphism', tip: 'The ability to present the same interface for differing underlying forms (data types or classes).', link: '/challenge/start' },
      { name: 'Interfaces / Traits', tip: 'Contracts that define what methods a class must implement without providing the implementation.', link: '/challenge/start' }
    ],
  },
  {
    id: 'memory_mgmt',
    level_required: 13,
    title: 'MEMORY & POINTERS',
    description: 'Understanding how memory works',
    icon: 'sim_card',
    subtopics: [
      { name: 'References', tip: 'Variables that refer to the memory location of another variable, acting as an alias.', link: '/challenge/start' },
      { name: 'Pointers', tip: 'Variables that store memory addresses directly, allowing powerful but unsafe direct memory manipulation.', link: '/challenge/start' },
      { name: 'Garbage Collection', tip: 'Automatic memory management that reclaims memory occupied by objects that are no longer in use.', link: '/challenge/start' }
    ],
  },
  {
    id: 'data_structures',
    level_required: 14,
    title: 'DATA STRUCTURES',
    description: 'Advanced data organization',
    icon: 'schema',
    subtopics: [
      { name: 'Linked Lists', tip: 'A sequence of nodes where each node points to the next, allowing efficient insertions and deletions.', link: '/challenge/start' },
      { name: 'Stacks & Queues', tip: 'Stack is LIFO (Last-In-First-Out). Queue is FIFO (First-In-First-Out).', link: '/challenge/start' },
      { name: 'Trees & Graphs', tip: 'Trees organize data hierarchically. Graphs represent networks of interconnected nodes (vertices and edges).', link: '/challenge/start' }
    ],
  },
  {
    id: 'algorithms',
    level_required: 15,
    title: 'ALGORITHMS',
    description: 'Solving problems efficiently',
    icon: 'sort',
    subtopics: [
      { name: 'Big-O Notation', tip: 'A mathematical notation describing the limiting behavior of a function regarding execution time or memory space.', link: '/challenge/start' },
      { name: 'Sorting', tip: 'Algorithms (like QuickSort or MergeSort) that put elements of a list in a certain order.', link: '/challenge/start' },
      { name: 'Recursion', tip: 'A method where the solution depends on solutions to smaller instances of the same problem. A function calling itself.', link: '/challenge/start' }
    ],
  },
  {
    id: 'concurrency',
    level_required: 16,
    title: 'CONCURRENCY',
    description: 'Doing multiple things at once',
    icon: 'sync_alt',
    subtopics: [
      { name: 'Threads', tip: 'The smallest sequence of programmed instructions that can be managed independently by a scheduler.', link: '/challenge/start' },
      { name: 'Async / Await', tip: 'Syntactic sugar for handling asynchronous operations without blocking the main execution thread.', link: '/challenge/start' },
      { name: 'Event Loops', tip: 'A programming construct that waits for and dispatches events or messages in a program.', link: '/challenge/start' },
      { name: 'Mutexes', tip: 'Mutual exclusion objects used to prevent multiple threads from accessing a shared resource simultaneously.', link: '/challenge/start' }
    ],
  }
];

export default function SkillTreeMap() {
  const { isAuthenticated } = useAuth();
  const [progress, setProgress] = useState<ProgressResponse | null>(null);
  const [selectedSubtopic, setSelectedSubtopic] = useState<{name: string, tip: string, link: string, mainTopic: string} | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      getMyProgress()
        .then(setProgress)
        .catch(console.error)
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const userLevel = progress?.level || 1;

  return (
    <div className="bg-[#E5E7EB] text-black font-space-grotesk selection:bg-black selection:text-white overflow-x-hidden min-h-screen">
      <TopBar title={<><span>Skill Tree</span> — Complete Path</>} />

      {/* Subtopic Tip Modal */}
      {selectedSubtopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#FFD700] border-4 border-black p-8 shadow-[16px_16px_0_black] max-w-lg w-full relative">
            <button 
              onClick={() => setSelectedSubtopic(null)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white border-2 border-black hover:bg-black hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined font-black">close</span>
            </button>
            
            <h2 className="text-3xl font-black font-space-grotesk tracking-tighter uppercase mb-4 pr-10 border-b-4 border-black pb-4">
              {selectedSubtopic.name}
            </h2>
            
            <div className="bg-white border-4 border-black p-6 mb-8 shadow-[6px_6px_0_black]">
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-4xl text-[#FF00FF]">lightbulb</span>
                <p className="font-jetbrains-mono font-bold text-lg leading-relaxed uppercase">
                  {selectedSubtopic.tip}
                </p>
              </div>
            </div>
            
            <Link 
              href={`${selectedSubtopic.link}?topic=${encodeURIComponent(selectedSubtopic.mainTopic)}&subtopic=${encodeURIComponent(selectedSubtopic.name)}&tip=${encodeURIComponent(selectedSubtopic.tip)}`}
              className="block w-full text-center bg-[#00FFFF] border-4 border-black px-6 py-4 text-xl font-black font-space-grotesk tracking-widest uppercase hover:-translate-y-1 hover:shadow-[6px_6px_0_black] active:translate-y-[2px] active:shadow-[0_0_0_black] transition-all"
            >
              Initiate Mission
            </Link>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="pt-[72px] pb-32 min-h-screen relative flex flex-col items-center bg-[#E5E7EB]">
        
        {/* Title */}
        <div className="relative z-20 text-center mb-16 px-4 mt-12 bg-white border-4 border-black p-8 shadow-[12px_12px_0_black]">
          <h1 className="text-4xl md:text-6xl font-black font-space-grotesk tracking-tighter text-black uppercase">
            Programming Tree
          </h1>
        </div>

        {/* Tree Container */}
        <div className="relative w-full max-w-5xl z-10 flex flex-col items-center">
          
          {/* Central Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-4 -translate-x-1/2 bg-black border-x-4 border-black z-0"></div>

          <div className="flex flex-col gap-24 relative py-10 w-full z-10">
            {skillTree.map((node, index) => {
              const isEven = index % 2 === 0;
              
              let nodeStyle = "";
              let iconColor = "";
              let subBg = "";
              let isLocked = false;
              let status: 'completed' | 'current' | 'locked' = 'locked';

              if (userLevel > node.level_required) {
                status = 'completed';
              } else if (userLevel === node.level_required) {
                status = 'current';
              } else {
                status = 'locked';
              }
              
              if (status === 'completed') {
                nodeStyle = "bg-[#A3E635] border-black shadow-[6px_6px_0_black]";
                iconColor = "text-black";
                subBg = "bg-white border-2 border-black shadow-[4px_4px_0_black] hover:bg-[#A3E635] hover:-translate-y-1 cursor-pointer transition-all";
              } else if (status === 'current') {
                nodeStyle = "bg-[#FF00FF] border-black shadow-[12px_12px_0_black] animate-bounce cursor-pointer";
                iconColor = "text-white";
                subBg = "bg-white border-4 border-black shadow-[6px_6px_0_black] hover:bg-[#FF00FF] hover:text-white hover:-translate-y-1 cursor-pointer transition-all";
              } else {
                isLocked = true;
                nodeStyle = "bg-[#D1D5DB] border-black border-dashed opacity-80 shadow-[none]";
                iconColor = "text-black";
                subBg = "bg-[#F3F4F6] border-2 border-dashed border-black opacity-80 text-gray-500 cursor-not-allowed";
              }

              return (
                <div key={node.id} className="relative flex items-center justify-center w-full group">
                  
                  {/* Left Content (Title & Description) */}
                  <div className={`absolute w-5/12 flex flex-col ${isEven ? 'right-[55%] items-end text-right pr-4' : 'left-[55%] items-start text-left pl-4'}`}>
                    <div className="bg-white border-4 border-black p-4 shadow-[6px_6px_0_black]">
                      <h3 className={`text-xl md:text-3xl font-black font-space-grotesk tracking-tighter uppercase ${status === 'current' ? 'text-[#FF00FF]' : 'text-black'}`}>
                        {node.title}
                      </h3>
                      <p className={`text-sm md:text-base font-jetbrains-mono font-bold mt-2 text-black`}>
                        {node.description}
                      </p>
                    </div>
                  </div>

                  {/* Central Node */}
                  <div className="relative z-20 flex items-center justify-center">
                    {status === 'current' ? (
                      <Link href="/challenge/predict">
                        <div className={`relative w-24 h-24 md:w-32 md:h-32 flex items-center justify-center border-4 z-20 transition-all active:translate-x-1 active:translate-y-1 active:shadow-[2px_2px_0_black] ${nodeStyle}`}>
                          <span className={`material-symbols-outlined text-5xl md:text-6xl ${iconColor}`}>{node.icon}</span>
                        </div>
                      </Link>
                    ) : (
                      <div className={`relative w-20 h-20 md:w-28 md:h-28 flex items-center justify-center border-4 z-20 ${nodeStyle}`}>
                        {status === 'completed' ? (
                          <span className={`material-symbols-outlined text-4xl md:text-5xl filled-icon ${iconColor}`}>check_circle</span>
                        ) : (
                          <span className={`material-symbols-outlined text-4xl md:text-5xl ${iconColor}`}>{node.icon}</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right Content (Subtopics) */}
                  <div className={`absolute w-5/12 flex flex-col gap-4 ${isEven ? 'left-[55%] items-start pl-4' : 'right-[55%] items-end pr-4'}`}>
                    {node.subtopics.map((sub, i) => {
                      const completedCount = progress?.completed_missions?.[sub.name] || 0;
                      const isSubtopicLocked = isLocked || (i > 0 && (progress?.completed_missions?.[node.subtopics[i-1].name] || 0) < 3);
                      const isSubtopicCompleted = completedCount >= 3;
                      
                      let subtopicStyle = subBg;
                      if (isSubtopicCompleted) {
                        subtopicStyle = "bg-[#A3E635] border-2 border-black shadow-[4px_4px_0_black] hover:-translate-y-1 cursor-pointer transition-all";
                      } else if (isSubtopicLocked) {
                        subtopicStyle = "bg-[#F3F4F6] border-2 border-dashed border-black opacity-80 text-gray-500 cursor-not-allowed";
                      }

                      return (
                        <button 
                          key={i} 
                          onClick={() => {
                            if (!isSubtopicLocked) {
                              setSelectedSubtopic({ ...sub, mainTopic: node.title });
                            }
                          }}
                          disabled={isSubtopicLocked}
                          className={`flex items-center gap-3 px-4 py-3 w-full text-left focus:outline-none ${subtopicStyle}`}
                        >
                          {isEven && <span className={`material-symbols-outlined text-xl text-black`}>
                            {isSubtopicCompleted ? 'check_circle' : 'turn_right'}
                          </span>}
                          <div className="flex-grow flex flex-col">
                            <span className={`font-jetbrains-mono text-sm md:text-base font-black tracking-widest uppercase ${isSubtopicLocked ? 'text-gray-500' : 'text-black'}`}>
                              {sub.name}
                            </span>
                            {!isSubtopicLocked && !isSubtopicCompleted && (
                              <span className="text-[10px] font-black text-black/60 uppercase">Progress: {completedCount}/5</span>
                            )}
                          </div>
                          {!isEven && <span className={`material-symbols-outlined text-xl text-black`} style={{ transform: 'scaleX(-1)' }}>
                            {isSubtopicCompleted ? 'check_circle' : 'turn_right'}
                          </span>}
                        </button>
                      );
                    })}
                  </div>

                </div>
              );
            })}
          </div> 
        </div>
      </main>
    </div>
  );
}
