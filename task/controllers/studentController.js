const Student = require('../models/Student');

const studentController = {
  getAllStudents: async (req, res) => {
    try {
      const { search, major, page = 1, limit = 10 } = req.query;
      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { createdAt: -1 }
      };

      let query = {};
      if (search && search.trim()) {
        query.$text = { $search: search.trim() };
      }

      if (major && major !== 'all') {
        query.major = new RegExp(major, 'i');
      }

      const students = await Student.find(query)
        .sort(options.sort)
        .limit(options.limit * 1)
        .skip((options.page - 1) * options.limit)
        .exec();

      const count = await Student.countDocuments(query);
      const totalPages = Math.ceil(count / options.limit);
      const majors = await Student.distinct('major');

      res.render('students/index', {
        title: 'Students',
        students,
        currentPage: options.page,
        totalPages,
        totalStudents: count,
        search: search || '',
        selectedMajor: major || 'all',
        majors,
        hasNextPage: options.page < totalPages,
        hasPrevPage: options.page > 1
      });
    } catch (error) {
      console.error('Error fetching students:', error);
      req.session.error = 'Error fetching students';
      res.redirect('/students');
    }
  },

  showCreateForm: (req, res) => {
    res.render('students/create', { 
      title: 'Add New Student',
      error: req.session.error 
    });
    req.session.error = null;
  },

  createStudent: async (req, res) => {
    try {
      const { firstName, lastName, email, studentId, age, major, gpa } = req.body;
      if (!firstName || !lastName || !email || !studentId || !age || !major) {
        req.session.error = 'All required fields must be filled';
        return res.redirect('/students/create');
      }

      const existingStudent = await Student.findOne({
        $or: [{ studentId }, { email }]
      });

      if (existingStudent) {
        req.session.error = 'Student ID or email already exists';
        return res.redirect('/students/create');
      }

      const student = new Student({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        studentId: studentId.trim(),
        age: parseInt(age),
        major: major.trim(),
        gpa: gpa ? parseFloat(gpa) : 0
      });

      await student.save();
      req.session.message = 'Student created successfully!';
      res.redirect('/students');
    } catch (error) {
      console.error('Error creating student:', error);
      req.session.error = 'Error creating student';
      res.redirect('/students/create');
    }
  },
  getStudent: async (req, res) => {
    try {
      const student = await Student.findById(req.params.id);
      
      if (!student) {
        req.session.error = 'Student not found';
        return res.redirect('/students');
      }

      res.render('students/show', {
        title: `${student.fullName}`,
        student
      });
    } catch (error) {
      console.error('Error fetching student:', error);
      req.session.error = 'Error fetching student';
      res.redirect('/students');
    }
  },


  showEditForm: async (req, res) => {
    try {
      const student = await Student.findById(req.params.id);
      
      if (!student) {
        req.session.error = 'Student not found';
        return res.redirect('/students');
      }

      res.render('students/edit', {
        title: `Edit ${student.fullName}`,
        student,
        error: req.session.error
      });
      req.session.error = null;
    } catch (error) {
      console.error('Error fetching student:', error);
      req.session.error = 'Error fetching student';
      res.redirect('/students');
    }
  },


  updateStudent: async (req, res) => {
    try {
      const { firstName, lastName, email, studentId, age, major, gpa, isActive } = req.body;
      const studentToUpdate = await Student.findById(req.params.id);

      if (!studentToUpdate) {
        req.session.error = 'Student not found';
        return res.redirect('/students');
      }

     
      if (!firstName || !lastName || !email || !studentId || !age || !major) {
        req.session.error = 'All required fields must be filled';
        return res.redirect(`/students/${req.params.id}/edit`);
      }

      
      const existingStudent = await Student.findOne({
        _id: { $ne: req.params.id },
        $or: [{ studentId }, { email }]
      });

      if (existingStudent) {
        req.session.error = 'Student ID or email already exists';
        return res.redirect(`/students/${req.params.id}/edit`);
      }

      const updatedStudent = await Student.findByIdAndUpdate(
        req.params.id,
        {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim().toLowerCase(),
          studentId: studentId.trim(),
          age: parseInt(age),
          major: major.trim(),
          gpa: gpa ? parseFloat(gpa) : 0,
          isActive: isActive === 'on'
        },
        { new: true, runValidators: true }
      );

      req.session.message = 'Student updated successfully!';
      res.redirect(`/students/${updatedStudent._id}`);
    } catch (error) {
      console.error('Error updating student:', error);
      req.session.error = 'Error updating student';
      res.redirect(`/students/${req.params.id}/edit`);
    }
  },

  deleteStudent: async (req, res) => {
    try {
      const student = await Student.findById(req.params.id);
      
      if (!student) {
        req.session.error = 'Student not found';
        return res.redirect('/students');
      }

      await Student.findByIdAndDelete(req.params.id);
      req.session.message = 'Student deleted successfully!';
      res.redirect('/students');
    } catch (error) {
      console.error('Error deleting student:', error);
      req.session.error = 'Error deleting student';
      res.redirect('/students');
    }
  }
};

module.exports = studentController;