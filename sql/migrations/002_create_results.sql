CREATE TABLE results (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  subject VARCHAR(50) NOT NULL,
  score INT NOT NULL,
  CONSTRAINT fk_results_student
    FOREIGN KEY (student_id) REFERENCES students(id)
);