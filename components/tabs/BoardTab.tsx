'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import FadeUp from '@/components/animations/FadeUp'
import type { ProjectResult } from '@/lib/types'

interface BoardTabProps {
  result: ProjectResult
}

type ColumnKey = 'todo' | 'inProgress' | 'done'

type BoardColumns = {
  todo: string[]
  inProgress: string[]
  done: string[]
}

const COLUMN_ORDER: ColumnKey[] = ['todo', 'inProgress', 'done']

const COLUMN_META: Record<
  ColumnKey,
  { label: string; color: string; borderColor: string }
> = {
  todo: {
    label: 'To Do',
    color: 'var(--color-text-primary)',
    borderColor: 'var(--color-border)',
  },
  inProgress: {
    label: 'In Progress',
    color: 'var(--color-accent-warning)',
    borderColor: 'var(--color-border-warning)',
  },
  done: {
    label: 'Done',
    color: 'var(--color-accent-success)',
    borderColor: 'var(--color-border-success)',
  },
}

const EMPTY_COLUMNS: BoardColumns = {
  todo: [],
  inProgress: [],
  done: [],
}

export default function BoardTab({ result }: BoardTabProps) {
  const [columns, setColumns] = useState<BoardColumns>(EMPTY_COLUMNS)
  const [draggedTask, setDraggedTask] = useState<string | null>(null)
  const [sourceColumn, setSourceColumn] = useState<ColumnKey | null>(null)

  useEffect(() => {
    const allTasks = result.roadmap.flatMap(
      (milestone) => milestone.tasks
    )
    setColumns({
      todo: allTasks,
      inProgress: [],
      done: [],
    })
  }, [result.roadmap])

  function moveTask(task: string, from: ColumnKey, to: ColumnKey) {
    if (from === to) {
      return
    }

    setColumns((prev) => ({
      ...prev,
      [from]: prev[from].filter((item) => item !== task),
      [to]: [...prev[to], task],
    }))
  }

  function handleDragStart(task: string, column: ColumnKey) {
    setDraggedTask(task)
    setSourceColumn(column)
  }

  function handleDrop(targetColumn: ColumnKey) {
    if (!draggedTask || !sourceColumn) {
      return
    }

    moveTask(draggedTask, sourceColumn, targetColumn)
    setDraggedTask(null)
    setSourceColumn(null)
  }

  function cycleTask(task: string, column: ColumnKey) {
    const currentIndex = COLUMN_ORDER.indexOf(column)
    const nextColumn = COLUMN_ORDER[(currentIndex + 1) % COLUMN_ORDER.length]
    moveTask(task, column, nextColumn)
  }

  return (
    <div style={styles.board}>
      {COLUMN_ORDER.map((columnKey, columnIndex) => {
        const meta = COLUMN_META[columnKey]
        const tasks = columns[columnKey]
        const delay = columnIndex * 0.08

        return (
          <FadeUp key={columnKey} delay={delay}>
            <section
              style={styles.column}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => handleDrop(columnKey)}
            >
              <div style={styles.columnHeader}>
                <span style={{ ...styles.columnTitle, color: meta.color }}>
                  {meta.label}
                </span>
                <span
                  style={{
                    ...styles.countBadge,
                    border: `0.5px solid ${meta.borderColor}`,
                    color: meta.color,
                  }}
                >
                  {tasks.length}
                </span>
              </div>

              <div style={styles.columnBody}>
                {tasks.map((task, taskIndex) => {
                  const isDragging = draggedTask === task

                  return (
                    <motion.button
                      key={task}
                      type="button"
                      draggable
                      onClick={() => cycleTask(task, columnKey)}
                      onDragStart={() => handleDragStart(task, columnKey)}
                      onDragEnd={() => {
                        setDraggedTask(null)
                        setSourceColumn(null)
                      }}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: taskIndex * 0.03 }}
                      whileDrag={{ scale: 1.03, rotate: 1 }}
                      style={{
                        ...styles.taskCard,
                        ...(columnKey === 'done' ? styles.doneTaskCard : null),
                        ...(isDragging ? styles.draggingTaskCard : null),
                      }}
                    >
                      {task}
                    </motion.button>
                  )
                })}
              </div>
            </section>
          </FadeUp>
        )
      })}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  board: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
  },
  column: {
    minHeight: '300px',
    border: '0.5px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '12px',
    backgroundColor: 'var(--color-bg-secondary)',
  },
  columnHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px',
  },
  columnTitle: {
    fontSize: '14px',
    fontWeight: 500,
  },
  countBadge: {
    width: '20px',
    height: '20px',
    borderRadius: '999px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--color-bg-secondary)',
    fontSize: '12px',
    fontWeight: 500,
  },
  columnBody: {
    minHeight: '256px',
  },
  taskCard: {
    width: '100%',
    textAlign: 'left',
    background: 'var(--color-bg-primary)',
    border: '0.5px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    padding: '10px 12px',
    fontSize: '13px',
    color: 'var(--color-text-primary)',
    cursor: 'grab',
    marginBottom: '8px',
  },
  doneTaskCard: {
    borderLeft: '3px solid var(--color-border-success)',
  },
  draggingTaskCard: {
    opacity: 0.5,
  },
}
