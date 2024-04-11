package database

import (
	"errors"

	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

type BaseDAO[T any] struct{}

func (b BaseDAO[T]) Migrate(db *gorm.DB, e T) error {
	return db.Set("gorm:table_options", "CHARSET=utf8mb4").AutoMigrate(e)
}

func (BaseDAO[T]) GetAll(db *gorm.DB, e T, cond ...T) ([]T, error) {
	var r []T
	tx := db
	for _, c := range cond {
		tx = tx.Where(c)
	}

	if err := tx.Find(&r, e).Error; err != nil {
		return nil, err
	}
	return r, nil
}

func (BaseDAO[T]) GetOne(db *gorm.DB, e T, cond ...T) (T, error) {
	var r T
	tx := db
	for _, c := range cond {
		tx = tx.Where(c)
	}

	if err := tx.First(&r, e).Error; err != nil {
		return r, err
	}
	return r, nil
}

func (BaseDAO[T]) GetSome(db *gorm.DB, e T, limit, offset int, cond ...T) ([]T, error) {
	var r []T
	tx := db
	for _, c := range cond {
		tx = tx.Where(c)
	}

	if err := tx.Find(&r, e).Limit(limit).Offset(offset).Error; err != nil {
		return nil, err
	}
	return r, nil
}

func (BaseDAO[T]) Create(db *gorm.DB, e T) (T, error) {
	if err := db.Create(e).Error; err != nil {
		return e, err
	}
	return e, nil
}

func (BaseDAO[T]) FirstOrCreate(db *gorm.DB, e T) (T, error) {
	if err := db.FirstOrCreate(&e).Error; err != nil {
		return e, err
	}
	return e, nil
}

func (BaseDAO[T]) Update(db *gorm.DB, e T, cond ...T) (T, error) {
	tx := db.Model(e)
	for _, c := range cond {
		tx = tx.Where(c)
	}

	if err := tx.Updates(&e).Error; err != nil {
		return e, err
	}
	return e, nil
}

func (b BaseDAO[T]) UpdateOrCreate(db *gorm.DB, e T, cond ...T) (T, error) {
	logrus.Debugf("got %v %v %v", db, e, cond)
	e, err := b.Update(db, e, cond...)
	if errors.Is(err, gorm.ErrRecordNotFound) {
		logrus.Debug("will create it")
		return b.Create(db, e)
	}
	logrus.Debugf("return %v %v", e, err)
	return e, err
}

func (BaseDAO[T]) Delete(db *gorm.DB, e T) error {
	if err := db.Delete(e).Error; err != nil {
		return err
	}
	return nil
}

type IBaseDAO interface {
	Migrate()

	GetAll()
	GetOne()
	GetSome()

	Create()
	FirstOrCreate()

	Update()
	UpdateOrCreate()

	Delete()
}
