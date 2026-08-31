"use client"

import { useState, useEffect } from "react"
import ElectricBorder from "./ElectricBorder"

interface TodoItem {
  id: number
  text: string
  completed: boolean
  priority: "low" | "medium" | "high" | "cosmic"
}

interface CosmicTodoListProps {
  backgroundColor?: string
  textColor?: string
  completedColor?: string
  accentColor?: string
  font?: {
    fontFamily?: string
    fontSize?: string
    fontWeight?: string
  }
  headerFont?: {
    fontFamily?: string
    fontSize?: string
    fontWeight?: string
  }
  isDayMode?: boolean
}

const initialTodos: TodoItem[] = [
  { id: 1, text: "Debug reality.exe", completed: false, priority: "cosmic" },
  { id: 2, text: "Refactor consciousness", completed: true, priority: "high" },
  { id: 3, text: "Optimize coffee intake", completed: false, priority: "cosmic" },
  { id: 4, text: "Deploy to production", completed: true, priority: "medium" },
  { id: 5, text: "Fix merge conflicts with universe", completed: false, priority: "high" },
  { id: 6, text: "Update neural dependencies", completed: false, priority: "medium" },
  { id: 7, text: "Backup memories to cloud", completed: true, priority: "low" },
  { id: 8, text: "Implement quantum algorithms", completed: false, priority: "cosmic" },
]

export default function CosmicTodoList({
  backgroundColor = "#0A0A0A",
  textColor = "#00FF00",
  completedColor = "#666666",
  accentColor = "#4FC1FF",
  font = { fontFamily: "monospace", fontSize: "14px" },
  headerFont = { fontFamily: "monospace", fontSize: "20px", fontWeight: "bold" },
  isDayMode = false,
}: CosmicTodoListProps) {
  const [todos, setTodos] = useState<TodoItem[]>(initialTodos)
  const [newTodo, setNewTodo] = useState("")
  const [glitchEffect, setGlitchEffect] = useState(false)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "cosmic":
        return "#FF00FF"
      case "high":
        return "#FF4444"
      case "medium":
        return "#FFAA00"
      case "low":
        return "#44FF44"
      default:
        return textColor
    }
  }

  const getDayModePriorityColor = (priority: string) => {
    switch (priority) {
      case "cosmic":
        return "#FF8C00"
      case "high":
        return "#FF6B35"
      case "medium":
        return "#FFB800"
      case "low":
        return "#FFC947"
      default:
        return "#1a1a1a"
    }
  }

  const toggleTodo = (id: number) => {
    setGlitchEffect(true)
    setTimeout(() => setGlitchEffect(false), 200)

    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const addTodo = () => {
    if (newTodo.trim()) {
      const newId = Math.max(...todos.map((t) => t.id)) + 1
      setTodos([
        ...todos,
        {
          id: newId,
          text: newTodo,
          completed: false,
          priority: "medium",
        },
      ])
      setNewTodo("")
    }
  }

  const completedCount = todos.filter((todo) => todo.completed).length
  const totalCount = todos.length
  const progressPercentage = (completedCount / totalCount) * 100

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchEffect(true)
      setTimeout(() => setGlitchEffect(false), 100)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // DAY MODE RENDER
  if (isDayMode) {
    const dayContent = (
      <div
        className="cosmic-todo-container"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          color: "#1a1a1a",
          fontFamily: font.fontFamily,
          fontSize: font.fontSize,
          fontWeight: font.fontWeight,
          padding: "20px",
          borderRadius: "12px",
          minWidth: "300px",
          maxWidth: "400px",
        }}
      >
        <div
          className="header"
          style={{
            fontFamily: headerFont.fontFamily,
            fontSize: headerFont.fontSize,
            fontWeight: headerFont.fontWeight,
            marginBottom: "16px",
            textAlign: "center",
            color: "#FFB800",
            textShadow: "0 0 15px #FFB80080",
          }}
        >
          ☀️ SOLAR DEV PROTOCOL
        </div>

        <div className="progress-bar" style={{ marginBottom: "16px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px",
              fontSize: "12px",
            }}
          >
            <span>
              Progress: {completedCount}/{totalCount}
            </span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div
            style={{
              width: "100%",
              height: "8px",
              backgroundColor: "#FFE8A1",
              borderRadius: "4px",
              overflow: "hidden",
              border: "1px solid #FFB80060",
            }}
          >
            <div
              style={{
                width: `${progressPercentage}%`,
                height: "100%",
                background: "linear-gradient(90deg, #FFB800, #FFA500)",
                transition: "width 0.3s ease",
                boxShadow: "0 0 15px #FFB80080",
              }}
            />
          </div>
        </div>

        <div className="todo-list" style={{ marginBottom: "16px", maxHeight: "300px", overflowY: "auto" }}>
          {todos.map((todo) => (
            <div
              key={todo.id}
              className="todo-item"
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "8px",
                padding: "8px",
                backgroundColor: todo.completed ? "rgba(255, 235, 180, 0.5)" : "rgba(255, 250, 230, 0.7)",
                border: `1px solid ${getDayModePriorityColor(todo.priority)}60`,
                borderRadius: "6px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: `0 2px 8px ${getDayModePriorityColor(todo.priority)}20`,
              }}
              onClick={() => toggleTodo(todo.id)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = todo.completed
                  ? "rgba(255, 230, 170, 0.7)"
                  : "rgba(255, 245, 210, 0.9)"
                e.currentTarget.style.borderColor = getDayModePriorityColor(todo.priority)
                e.currentTarget.style.boxShadow = `0 4px 12px ${getDayModePriorityColor(todo.priority)}40`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = todo.completed
                  ? "rgba(255, 235, 180, 0.5)"
                  : "rgba(255, 250, 230, 0.7)"
                e.currentTarget.style.borderColor = `${getDayModePriorityColor(todo.priority)}60`
                e.currentTarget.style.boxShadow = `0 2px 8px ${getDayModePriorityColor(todo.priority)}20`
              }}
            >
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  border: `2px solid ${getDayModePriorityColor(todo.priority)}`,
                  borderRadius: "3px",
                  marginRight: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: todo.completed ? getDayModePriorityColor(todo.priority) : "transparent",
                  transition: "all 0.2s ease",
                }}
              >
                {todo.completed && (
                  <span style={{ color: "#ffffff", fontSize: "12px", fontWeight: "bold" }}>✓</span>
                )}
              </div>
              <span
                style={{
                  flex: 1,
                  textDecoration: todo.completed ? "line-through" : "none",
                  color: todo.completed ? "#999999" : "#1a1a1a",
                  opacity: todo.completed ? 0.7 : 1,
                }}
              >
                {todo.text}
              </span>
              <span
                style={{
                  fontSize: "10px",
                  color: getDayModePriorityColor(todo.priority),
                  marginLeft: "8px",
                  textTransform: "uppercase",
                  fontWeight: "bold",
                }}
              >
                {todo.priority}
              </span>
            </div>
          ))}
        </div>

        <div className="add-todo" style={{ display: "flex", gap: "8px" }}>
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addTodo()}
            placeholder="Add solar task..."
            style={{
              flex: 1,
              padding: "8px",
              backgroundColor: "rgba(255, 250, 230, 0.7)",
              border: "1px solid #FFB80060",
              borderRadius: "4px",
              color: "#1a1a1a",
              fontSize: font.fontSize,
              fontFamily: font.fontFamily,
              outline: "none",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#FFB800"
              e.target.style.boxShadow = "0 0 15px #FFB80060"
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#FFB80060"
              e.target.style.boxShadow = "none"
            }}
          />
          <button
            onClick={addTodo}
            style={{
              padding: "8px 12px",
              backgroundColor: "#FFB800",
              color: "#ffffff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: font.fontSize,
              fontFamily: font.fontFamily,
              fontWeight: "bold",
              transition: "all 0.2s ease",
              boxShadow: "0 0 10px #FFB80060",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#FFA500"
              e.currentTarget.style.boxShadow = "0 0 20px #FFA50080"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#FFB800"
              e.currentTarget.style.boxShadow = "0 0 10px #FFB80060"
            }}
          >
            +
          </button>
        </div>

        <div
          className="footer"
          style={{
            marginTop: "16px",
            textAlign: "center",
            fontSize: "10px",
            color: "#1a1a1a99",
            fontStyle: "italic",
          }}
        >
          // Powered by solar energy ☀️
        </div>
      </div>
    )

    return (
      <ElectricBorder color="#FFB800" speed={0.8} chaos={0.2} borderRadius={12}>
        {dayContent}
      </ElectricBorder>
    )
  }

  // NIGHT MODE RENDER - EXACT ORIGINAL
  return (
    <div
      className={`cosmic-todo-container ${glitchEffect ? "glitch" : ""}`}
      style={{
        backgroundColor,
        color: textColor,
        fontFamily: font.fontFamily,
        fontSize: font.fontSize,
        fontWeight: font.fontWeight,
        padding: "20px",
        borderRadius: "12px",
        border: `2px solid ${accentColor}`,
        boxShadow: `0 0 20px ${accentColor}40`,
        minWidth: "300px",
        maxWidth: "400px",
      }}
    >
      <div
        className="header"
        style={{
          fontFamily: headerFont.fontFamily,
          fontSize: headerFont.fontSize,
          fontWeight: headerFont.fontWeight,
          marginBottom: "16px",
          textAlign: "center",
          color: accentColor,
          textShadow: `0 0 10px ${accentColor}`,
        }}
      >
        🚀 COSMIC DEV PROTOCOL
      </div>

      <div className="progress-bar" style={{ marginBottom: "16px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "8px",
            fontSize: "12px",
          }}
        >
          <span>
            Progress: {completedCount}/{totalCount}
          </span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <div
          style={{
            width: "100%",
            height: "8px",
            backgroundColor: "#333",
            borderRadius: "4px",
            overflow: "hidden",
            border: `1px solid ${accentColor}40`,
          }}
        >
          <div
            style={{
              width: `${progressPercentage}%`,
              height: "100%",
              background: `linear-gradient(90deg, ${accentColor}, #00FF00)`,
              transition: "width 0.3s ease",
              boxShadow: `0 0 10px ${accentColor}`,
            }}
          />
        </div>
      </div>

      <div className="todo-list" style={{ marginBottom: "16px", maxHeight: "300px", overflowY: "auto" }}>
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="todo-item"
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "8px",
              padding: "8px",
              backgroundColor: todo.completed ? "#1a1a1a" : "#0f0f0f",
              border: `1px solid ${getPriorityColor(todo.priority)}40`,
              borderRadius: "6px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onClick={() => toggleTodo(todo.id)}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = todo.completed ? "#2a2a2a" : "#1f1f1f"
              e.currentTarget.style.borderColor = getPriorityColor(todo.priority)
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = todo.completed ? "#1a1a1a" : "#0f0f0f"
              e.currentTarget.style.borderColor = `${getPriorityColor(todo.priority)}40`
            }}
          >
            <div
              style={{
                width: "16px",
                height: "16px",
                border: `2px solid ${getPriorityColor(todo.priority)}`,
                borderRadius: "3px",
                marginRight: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: todo.completed ? getPriorityColor(todo.priority) : "transparent",
                transition: "all 0.2s ease",
              }}
            >
              {todo.completed && (
                <span style={{ color: backgroundColor, fontSize: "12px", fontWeight: "bold" }}>✓</span>
              )}
            </div>
            <span
              style={{
                flex: 1,
                textDecoration: todo.completed ? "line-through" : "none",
                color: todo.completed ? completedColor : textColor,
                opacity: todo.completed ? 0.7 : 1,
              }}
            >
              {todo.text}
            </span>
            <span
              style={{
                fontSize: "10px",
                color: getPriorityColor(todo.priority),
                marginLeft: "8px",
                textTransform: "uppercase",
                fontWeight: "bold",
              }}
            >
              {todo.priority}
            </span>
          </div>
        ))}
      </div>

      <div className="add-todo" style={{ display: "flex", gap: "8px" }}>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addTodo()}
          placeholder="Add cosmic task..."
          style={{
            flex: 1,
            padding: "8px",
            backgroundColor: "#1a1a1a",
            border: `1px solid ${accentColor}40`,
            borderRadius: "4px",
            color: textColor,
            fontSize: font.fontSize,
            fontFamily: font.fontFamily,
            outline: "none",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = accentColor
            e.target.style.boxShadow = `0 0 10px ${accentColor}40`
          }}
          onBlur={(e) => {
            e.target.style.borderColor = `${accentColor}40`
            e.target.style.boxShadow = "none"
          }}
        />
        <button
          onClick={addTodo}
          style={{
            padding: "8px 12px",
            backgroundColor: accentColor,
            color: backgroundColor,
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: font.fontSize,
            fontFamily: font.fontFamily,
            fontWeight: "bold",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#00FF00"
            e.currentTarget.style.boxShadow = `0 0 15px #00FF00`
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = accentColor
            e.currentTarget.style.boxShadow = "none"
          }}
        >
          +
        </button>
      </div>

      <div
        className="footer"
        style={{
          marginTop: "16px",
          textAlign: "center",
          fontSize: "10px",
          color: `${textColor}80`,
          fontStyle: "italic",
        }}
      >
        // Survival protocol for cosmic developers
      </div>

      <style jsx>{`
        .cosmic-todo-container {
          position: relative;
          overflow: hidden;
        }

        .cosmic-todo-container::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, ${accentColor}, #00FF00, ${accentColor});
          border-radius: 14px;
          z-index: -1;
          animation: borderGlow 3s ease-in-out infinite alternate;
        }

        .cosmic-todo-container.glitch {
          animation: glitchEffect 0.2s ease-in-out;
        }

        @keyframes borderGlow {
          0% { opacity: 0.5; }
          100% { opacity: 1; }
        }

        @keyframes glitchEffect {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(-1px, 1px); }
          40% { transform: translate(-1px, -1px); }
          60% { transform: translate(1px, 1px); }
          80% { transform: translate(1px, -1px); }
        }

        .todo-list::-webkit-scrollbar {
          width: 6px;
        }

        .todo-list::-webkit-scrollbar-track {
          background: #1a1a1a;
          border-radius: 3px;
        }

        .todo-list::-webkit-scrollbar-thumb {
          background: ${accentColor};
          border-radius: 3px;
        }

        .todo-list::-webkit-scrollbar-thumb:hover {
          background: #00FF00;
        }
      `}</style>
    </div>
  )
}
