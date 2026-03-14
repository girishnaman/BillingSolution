package com.billing.BillingSoftware.service.impl;

import com.billing.BillingSoftware.dto.ItemRequest;
import com.billing.BillingSoftware.dto.ItemResponse;
import com.billing.BillingSoftware.entity.CategoryEntity;
import com.billing.BillingSoftware.entity.ItemEntity;
import com.billing.BillingSoftware.repository.CategoryRepository;
import com.billing.BillingSoftware.repository.ItemRepository;
import com.billing.BillingSoftware.service.FileUploadService;
import com.billing.BillingSoftware.service.ItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ItemServiceImpl implements ItemService {

    private final FileUploadService fileUploadService;
    private final CategoryRepository categoryRepository;
    private final ItemRepository itemRepository;

    @Override
    public ItemResponse add(ItemRequest itemRequest, MultipartFile file) {
        String imgUrl = fileUploadService.uploadFile(file);
        ItemEntity itemEntity = convertToEntity(itemRequest);
        CategoryEntity existingCategory = categoryRepository.findByCategoryId(itemRequest.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found" + itemRequest.getCategoryId()));
        itemEntity.setCategory(existingCategory);
        itemEntity.setImgUrl(imgUrl);
        itemEntity = itemRepository.save(itemEntity);

        return convertToResponse(itemEntity);
    }

    private ItemEntity convertToEntity(ItemRequest itemRequest) {

        return ItemEntity.builder()
                .itemId(UUID.randomUUID().toString())
                .name(itemRequest.getName())
                .description(itemRequest.getDescription())
                .price(itemRequest.getPrice())
                .build();
    }

    private  ItemResponse convertToResponse(ItemEntity itemEntity) {

        return ItemResponse.builder()
                .itemId(itemEntity.getItemId())
                .name(itemEntity.getName())
                .description(itemEntity.getDescription())
                .price(itemEntity.getPrice())
                .imgUrl(itemEntity.getImgUrl())
                .categoryName(itemEntity.getCategory().getName())
                .categoryId(itemEntity.getCategory().getCategoryId())
                .createdAt(itemEntity.getCreatedAt())
                .updatedAt(itemEntity.getUpdatedAt())
                .build();
    }

    @Override
    public List<ItemResponse> fetchItems() {

        return itemRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteItem(String itemId) {

        ItemEntity itemEntity = itemRepository.findByItemId(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found" + itemId));

        boolean isFileDelete = fileUploadService.deleteFile(itemEntity.getImgUrl());
        if (isFileDelete) {
            itemRepository.delete(itemEntity);
        } else {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Unable  to delete the image");
        }
    }
}
