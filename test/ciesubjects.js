const CIESubjects = require('../view/CIESubjects.js')
const should = require('should')

module.exports = () =>
  describe('CIESubjects.js', function () {
    it('should return [] for empty search', function () {
      CIESubjects.search('').should.be.an.Array().and.have.length(0)
    })
    it('should return [] for query " "', function () {
      CIESubjects.search(' ').should.be.an.Array().and.have.length(0)
    })
    it('should return the subject given when searching for an exact ID', function () {
      CIESubjects.search('0610').should.deepEqual([{id: '0610', level: 'IGCSE', name: 'Biology'}])
    })
    it('should return some subjects for query "Biology"', function () {
      let sr = CIESubjects.search('Biology')
      sr.should.be.an.Array()
      sr.length.should.be.aboveOrEqual(2)
      sr.forEach(s => s.name.should.match(/biology/i))
    })
    it('should return some subjects for query "bIOLOGY"', function () {
      let sr = CIESubjects.search('bIOLOGY')
      sr.should.be.an.Array()
      sr.length.should.be.aboveOrEqual(2)
      sr.forEach(s => s.name.should.match(/biology/i))
    })
    it('should return some subjects for query " chemistry "', function () {
      let sr = CIESubjects.search(' chemistry ')
      sr.should.be.an.Array()
      sr.length.should.be.aboveOrEqual(2)
      sr.forEach(s => s.name.should.match(/chemistry/i))
    })
    it('should return the subject for findExactById', function () {
      CIESubjects.findExactById('0620').should.deepEqual({id: '0620', name: 'Chemistry', level: 'IGCSE'})
    })
    it('should return undefined for findExactById with a non-existing ID', function () {
      should.not.exist(CIESubjects.findExactById('0000'))
    })
  })
