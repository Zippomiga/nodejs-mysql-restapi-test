import { pool } from "../db.js"

export const getEmployees = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM employee'
    )
    res.json(rows)

  } catch (error) {
    throwError(res)
  }
}

export const getEmployee = async (req, res) => {
  const { id } = req.params

  try {
    const [rows] = await pool.query(
      'SELECT * FROM employee WHERE id = ?', [id]
    )
    const notFound = rows.length <= 0

    noEmployee(notFound, res, id)

    res.json(rows[0])

  } catch (error) {
    throwError(res)
  }
}

export const createEmployee = async (req, res) => {
  const { name, salary } = req.body

  try {
    const [rows] = await pool.query(
      'INSERT INTO employee(name, salary) VALUES (?, ?)', [name, salary]
    )
    res.send({
      id: rows.insertId,
      name,
      salary
    })

  } catch (error) {
    throwError(res)
  }
}

export const deleteEmployee = async (req, res) => {
  const { name } = req.body
  const { id } = req.params

  try {
    const [result] = await pool.query(
      'DELETE FROM employee WHERE ID = ?', [id]
    )
    const notFound = result.affectedRows <= 0

    noEmployee(notFound, res, id)

    res.json(`Employee ${name} deleted`)

  } catch (error) {
    throwError(res)
  }
}


export const updateEmployee = async (req, res) => {
  const { name, salary } = req.body
  const { id } = req.params

  try {
    const [result] = await pool.query(
      'UPDATE employee SET name = IFNULL(?, name), salary = IFNULL(?, salary) WHERE id = ?', [name, salary, id]
    )
    const notFound = result.affectedRows === 0

    noEmployee(notFound, res, id)

    const [rows] = await pool.query(
      'SELECT * FROM employee WHERE id = ?', [id]
    )

    res.json(rows[0])

  } catch (error) {
    throwError(res)
  }
}



function noEmployee(notFound, res, id) {
  if (notFound) {
    return res
      .status(404)
      .json(`Employee ${id} not found`)
  }
}


const throwError = res => res.status(500).json('Something went wrong')