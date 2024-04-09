package database

import (
	"errors"

	"gorm.io/gorm"
)

type BaseDAO[T any] struct {
	db *gorm.DB
}

func NewDAO[T any](db *gorm.DB) *BaseDAO[T] {
	return &BaseDAO[T]{
		db: db,
	}
}

/* Single Table Operations */

func (b *BaseDAO[T]) GetAll(e T) ([]T, error) {
	var r []T
	if err := b.db.Find(&r, e).Error; err != nil {
		return nil, err
	}
	return r, nil
}

func (b *BaseDAO[T]) GetOne(e T) (T, error) {
	var r T
	if err := b.db.First(&r, e).Error; err != nil {
		return r, err
	}
	return r, nil
}

func (b *BaseDAO[T]) GetSome(e T, limit, offset int) ([]T, error) {
	var r []T
	if err := b.db.Find(&r, e).Limit(limit).Offset(offset).Error; err != nil {
		return nil, err
	}
	return r, nil
}

func (b *BaseDAO[T]) Create(e T) (T, error) {
	if err := b.db.Create(&e).Error; err != nil {
		return e, err
	}
	return e, nil
}

func (b *BaseDAO[T]) Update(e T) (T, error) {
	if err := b.db.Updates(&e).Error; err != nil {
		return e, err
	}
	return e, nil
}

func (b *BaseDAO[T]) UpdateOrCreate(e T) (T, error) {
	var r T
	err := b.db.First(&r, e).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return b.Create(e)
		}
		return e, err
	}
	return b.Update(e)
}

func (b *BaseDAO[T]) Delete(e T) error {
	if err := b.db.Delete(e).Error; err != nil {
		return err
	}
	return nil
}
