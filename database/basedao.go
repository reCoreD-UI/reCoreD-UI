package database

import (
	"errors"

	clone "github.com/huandu/go-clone/generic"
	"gorm.io/gorm"
)

type BaseDAO[T any] struct{}

func (b BaseDAO[T]) Migrate(db *gorm.DB, e T) error {
	return db.Set("gorm:table_options", "CHARSET=utf8mb4").AutoMigrate(e)
}

func (BaseDAO[T]) GetAll(db *gorm.DB, e T, cond ...T) ([]T, error) {
	var r []T
	tx := db.Model(e)
	for _, c := range cond {
		tx = tx.Where(c)
	}

	rows, err := tx.Rows()
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		if err := db.ScanRows(rows, e); err != nil {
			return nil, err
		}

		i := clone.Clone(e)

		r = append(r, i)
	}

	return r, nil
}

func (BaseDAO[T]) GetOne(db *gorm.DB, e T, cond ...T) (T, error) {
	tx := db
	for _, c := range cond {
		tx = tx.Where(c)
	}

	if err := tx.First(e).Error; err != nil {
		return e, err
	}
	return e, nil
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

	result := tx.Updates(e)

	if err := result.Error; err != nil {
		return e, err
	}
	if result.RowsAffected == 0 {
		return e, gorm.ErrRecordNotFound
	}
	return e, nil
}

func (b BaseDAO[T]) UpdateOrCreate(db *gorm.DB, e T, cond ...T) (T, error) {
	_, err := b.Update(db, e, cond...)
	if errors.Is(err, gorm.ErrRecordNotFound) {
		_, err = b.Create(db, e)
	}
	return e, err
}

func (BaseDAO[T]) Delete(db *gorm.DB, e T, cond ...T) error {
	tx := db
	for _, c := range cond {
		tx = tx.Where(c)
	}

	if err := tx.Delete(e).Error; err != nil {
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
